package com.outsmartai.backend.service;

import com.outsmartai.backend.dto.GameStartRequest;
import com.outsmartai.backend.dto.GameSubmitRequest;
import com.outsmartai.backend.dto.HintResponse;
import com.outsmartai.backend.dto.ResultResponse;
import com.outsmartai.backend.model.*;
import com.outsmartai.backend.repository.GameSessionRepository;
import com.outsmartai.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;

@Service
public class GameService {

    private final GameSessionRepository gameSessionRepository;
    private final UserRepository userRepository;
    private final NemotronService nemotronService;

    public GameService(GameSessionRepository gameSessionRepository, UserRepository userRepository, NemotronService nemotronService) {
        this.gameSessionRepository = gameSessionRepository;
        this.userRepository = userRepository;
        this.nemotronService = nemotronService;
    }

    public GameSession startGame(String userId, GameStartRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (request.isDaily()) {
            LocalDate today = LocalDate.now();
            if (today.equals(user.getLastDailyChallengeDate())) {
                throw new RuntimeException("You have already completed today's official Daily AI Challenge!");
            }
        }

        NemotronService.ChallengeData challenge = nemotronService.generateChallenge(request.getGameType(), request.getDifficulty());

        GameSession session = new GameSession();
        session.setUserId(user.getId());
        session.setUsername(user.getUsername());
        session.setGameType(request.getGameType());
        session.setDifficulty(request.getDifficulty());
        session.setQuestion(challenge.question);
        session.setOptions(challenge.options);
        session.setCorrectAnswer(challenge.correctAnswer);
        session.setHintText(challenge.hint);
        session.setDaily(request.isDaily());
        session.setStartedAt(Instant.now());

        // Timer limit: 180s for AI battle/Lateral, 120s for others
        long secondsAllowed = (request.getGameType() == GameType.AI_BATTLE || request.getGameType() == GameType.LATERAL) ? 180 : 120;
        session.setExpiresAt(session.getStartedAt().plusSeconds(secondsAllowed));
        session.setStatus(GameStatus.IN_PROGRESS);

        GameSession saved = gameSessionRepository.save(session);
        return copyForClient(saved);
    }

    public GameSession getGameSession(String gameId, String userId) {
        GameSession session = gameSessionRepository.findByIdAndUserId(gameId, userId)
                .orElseThrow(() -> new RuntimeException("Game session not found or unauthorized"));

        return copyForClient(session);
    }

    public HintResponse requestHint(String gameId, String userId) {
        GameSession session = gameSessionRepository.findByIdAndUserId(gameId, userId)
                .orElseThrow(() -> new RuntimeException("Game session not found or unauthorized"));

        if (session.getStatus() != GameStatus.IN_PROGRESS) {
            throw new RuntimeException("Cannot request hint for completed/expired game.");
        }

        if (!session.isHintRequested()) {
            session.setHintRequested(true);
            if (session.getHintText() == null || session.getHintText().isBlank()) {
                String hint = nemotronService.generateHint(session.getGameType(), session.getQuestion(), session.getCorrectAnswer());
                session.setHintText(hint);
            }
            gameSessionRepository.save(session);
        }

        return new HintResponse(session.getHintText());
    }

    public ResultResponse submitAnswer(String gameId, String userId, GameSubmitRequest request) {
        GameSession session = gameSessionRepository.findByIdAndUserId(gameId, userId)
                .orElseThrow(() -> new RuntimeException("Game session not found or unauthorized"));

        if (session.getStatus() != GameStatus.IN_PROGRESS) {
            throw new RuntimeException("This game session has already been completed or expired.");
        }

        Instant now = Instant.now();
        boolean isExpired = now.isAfter(session.getExpiresAt());
        if (isExpired) {
            session.setStatus(GameStatus.EXPIRED);
        } else {
            session.setStatus(GameStatus.COMPLETED);
        }

        session.setUserAnswer(request.getUserAnswer());
        session.setCompletedAt(now);

        // Evaluate with Nemotron
        NemotronService.EvaluationData eval = nemotronService.evaluateUserAnswer(
                session.getGameType(),
                session.getQuestion(),
                session.getCorrectAnswer(),
                request.getUserAnswer()
        );

        session.setAiEvaluation(eval.explanation);

        if (isExpired) {
            session.setScore(0);
            session.setCorrectnessScore(0);
            session.setReasoningScore(0);
            session.setSpeedScore(0);
            session.setRatingChange(0);
        } else {
            int maxScore = session.getDifficulty().getMaxScore();
            int correctnessScore = (eval.correctness * maxScore) / 100;
            int reasoningScore = (eval.reasoningQuality * 50) / 100;

            long secondsTaken = Duration.between(session.getStartedAt(), now).getSeconds();
            long totalAllowed = Duration.between(session.getStartedAt(), session.getExpiresAt()).getSeconds();
            double timeFractionRemaining = Math.max(0, (double) (totalAllowed - secondsTaken) / totalAllowed);
            int speedScore = (int) (timeFractionRemaining * 50);

            int totalCalculatedScore = correctnessScore + reasoningScore + speedScore;

            if (session.isHintRequested()) {
                totalCalculatedScore = (int) (totalCalculatedScore * 0.75); // 25% penalty
            }

            session.setScore(totalCalculatedScore);
            session.setCorrectnessScore(correctnessScore);
            session.setReasoningScore(reasoningScore);
            session.setSpeedScore(speedScore);

            int ratingDelta = (totalCalculatedScore >= 120) ? 25 : (totalCalculatedScore >= 75) ? 15 : (totalCalculatedScore >= 40) ? 5 : -10;
            session.setRatingChange(ratingDelta);
        }

        GameSession savedSession = gameSessionRepository.save(session);

        // Update User statistics
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.setGamesPlayed(user.getGamesPlayed() + 1);
        user.setTotalScore(user.getTotalScore() + savedSession.getScore());
        user.setRating(Math.max(100, user.getRating() + savedSession.getRatingChange()));
        if (savedSession.getScore() > user.getBestScore()) {
            user.setBestScore(savedSession.getScore());
        }

        if (savedSession.getScore() >= 50) {
            user.setGamesWon(user.getGamesWon() + 1);
        }

        // Streak calculation
        LocalDate today = LocalDate.now();
        if (user.getLastActiveDate() != null) {
            if (user.getLastActiveDate().equals(today.minusDays(1))) {
                user.setCurrentStreak(user.getCurrentStreak() + 1);
            } else if (!user.getLastActiveDate().equals(today)) {
                user.setCurrentStreak(1);
            }
        } else {
            user.setCurrentStreak(1);
        }

        if (user.getCurrentStreak() > user.getBestStreak()) {
            user.setBestStreak(user.getCurrentStreak());
        }

        user.setLastActiveDate(today);
        if (session.isDaily()) {
            user.setLastDailyChallengeDate(today);
        }

        userRepository.save(user);

        return mapToResultResponse(savedSession);
    }

    public ResultResponse getResultById(String resultId) {
        GameSession session = gameSessionRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found: " + resultId));

        return mapToResultResponse(session);
    }

    private GameSession copyForClient(GameSession session) {
        GameSession copy = new GameSession();
        copy.setId(session.getId());
        copy.setUserId(session.getUserId());
        copy.setUsername(session.getUsername());
        copy.setGameType(session.getGameType());
        copy.setDifficulty(session.getDifficulty());
        copy.setQuestion(session.getQuestion());
        copy.setOptions(session.getOptions());
        copy.setStartedAt(session.getStartedAt());
        copy.setExpiresAt(session.getExpiresAt());
        copy.setStatus(session.getStatus());
        copy.setDaily(session.isDaily());
        copy.setHintRequested(session.isHintRequested());
        if (session.isHintRequested()) {
            copy.setHintText(session.getHintText());
        }
        if (session.getStatus() != GameStatus.IN_PROGRESS) {
            copy.setCorrectAnswer(session.getCorrectAnswer());
            copy.setUserAnswer(session.getUserAnswer());
            copy.setAiEvaluation(session.getAiEvaluation());
            copy.setScore(session.getScore());
            copy.setRatingChange(session.getRatingChange());
        }
        return copy;
    }

    private ResultResponse mapToResultResponse(GameSession session) {
        ResultResponse res = new ResultResponse();
        res.setId(session.getId());
        res.setUsername(session.getUsername());
        res.setGameType(session.getGameType());
        res.setDifficulty(session.getDifficulty());
        res.setQuestion(session.getQuestion());
        res.setUserAnswer(session.getUserAnswer());
        res.setCorrectAnswer(session.getCorrectAnswer());
        res.setAiEvaluation(session.getAiEvaluation());
        res.setScore(session.getScore());
        res.setCorrectnessScore(session.getCorrectnessScore());
        res.setReasoningScore(session.getReasoningScore());
        res.setSpeedScore(session.getSpeedScore());
        res.setRatingChange(session.getRatingChange());
        res.setCompletedAt(session.getCompletedAt());
        return res;
    }
}
