package com.outsmartai.backend.service;

import com.outsmartai.backend.dto.DailyChallengeStatusResponse;
import com.outsmartai.backend.dto.LiveStatsResponse;
import com.outsmartai.backend.model.GameSession;
import com.outsmartai.backend.model.GameStatus;
import com.outsmartai.backend.model.User;
import com.outsmartai.backend.repository.GameSessionRepository;
import com.outsmartai.backend.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class StatsService {

    private final UserRepository userRepository;
    private final GameSessionRepository gameSessionRepository;

    public StatsService(UserRepository userRepository, GameSessionRepository gameSessionRepository) {
        this.userRepository = userRepository;
        this.gameSessionRepository = gameSessionRepository;
    }

    public LiveStatsResponse getLiveStats() {
        long activeGames = gameSessionRepository.countByStatus(GameStatus.IN_PROGRESS);
        Instant todayStart = Instant.now().minus(24, ChronoUnit.HOURS);
        long gamesCompletedToday = gameSessionRepository.countByCompletedAtAfter(todayStart);
        long registeredPlayers = userRepository.count();

        return new LiveStatsResponse(activeGames, gamesCompletedToday, registeredPlayers);
    }

    public DailyChallengeStatusResponse getDailyChallengeStatus(String currentUserId) {
        boolean completedToday = false;
        if (currentUserId != null) {
            User user = userRepository.findById(currentUserId).orElse(null);
            if (user != null && user.getLastDailyChallengeDate() != null) {
                completedToday = user.getLastDailyChallengeDate().equals(LocalDate.now());
            }
        }

        Instant todayStart = Instant.now().minus(24, ChronoUnit.HOURS);
        List<GameSession> dailySessions = gameSessionRepository.findByCompletedAtAfterAndStatusAndIsDailyOrderByScoreDesc(
                todayStart, GameStatus.COMPLETED, true, PageRequest.of(0, 100));

        long totalAttemptsToday = dailySessions.size();
        int averageScoreToday = 0;
        if (totalAttemptsToday > 0) {
            int totalScore = dailySessions.stream().mapToInt(GameSession::getScore).sum();
            averageScoreToday = (int) (totalScore / totalAttemptsToday);
        }

        return new DailyChallengeStatusResponse(
                completedToday,
                totalAttemptsToday,
                averageScoreToday,
                "🔥 Daily AI Nemotron Challenge",
                "Face today's official reasoning paradox crafted by Nemotron Ultra. Earn official streak points!"
        );
    }
}
