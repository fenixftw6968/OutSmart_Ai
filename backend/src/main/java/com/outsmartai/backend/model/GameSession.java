package com.outsmartai.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "game_sessions")
public class GameSession {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String username;

    private GameType gameType;
    private Difficulty difficulty;

    private String question;
    private List<String> options; // For multiple choice games
    private String correctAnswer; // Secret canonical answer on backend
    private String userAnswer;

    private boolean hintRequested = false;
    private String hintText;

    private String aiEvaluation; // Feedback reasoning from Nemotron

    private int score = 0;
    private int ratingChange = 0;
    private int correctnessScore = 0;
    private int reasoningScore = 0;
    private int speedScore = 0;

    @Indexed
    private Instant startedAt = Instant.now();
    private Instant expiresAt;
    private Instant completedAt;

    private boolean isDaily = false;

    @Indexed
    private GameStatus status = GameStatus.IN_PROGRESS;

    public GameSession() {
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public GameType getGameType() { return gameType; }
    public void setGameType(GameType gameType) { this.gameType = gameType; }

    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public String getUserAnswer() { return userAnswer; }
    public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }

    public boolean isHintRequested() { return hintRequested; }
    public void setHintRequested(boolean hintRequested) { this.hintRequested = hintRequested; }

    public String getHintText() { return hintText; }
    public void setHintText(String hintText) { this.hintText = hintText; }

    public String getAiEvaluation() { return aiEvaluation; }
    public void setAiEvaluation(String aiEvaluation) { this.aiEvaluation = aiEvaluation; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getRatingChange() { return ratingChange; }
    public void setRatingChange(int ratingChange) { this.ratingChange = ratingChange; }

    public int getCorrectnessScore() { return correctnessScore; }
    public void setCorrectnessScore(int correctnessScore) { this.correctnessScore = correctnessScore; }

    public int getReasoningScore() { return reasoningScore; }
    public void setReasoningScore(int reasoningScore) { this.reasoningScore = reasoningScore; }

    public int getSpeedScore() { return speedScore; }
    public void setSpeedScore(int speedScore) { this.speedScore = speedScore; }

    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public boolean isDaily() { return isDaily; }
    public void setDaily(boolean daily) { isDaily = daily; }

    public GameStatus getStatus() { return status; }
    public void setStatus(GameStatus status) { this.status = status; }
}
