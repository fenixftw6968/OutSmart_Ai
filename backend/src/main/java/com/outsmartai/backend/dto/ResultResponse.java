package com.outsmartai.backend.dto;

import com.outsmartai.backend.model.Difficulty;
import com.outsmartai.backend.model.GameType;

import java.time.Instant;

public class ResultResponse {
    private String id;
    private String username;
    private GameType gameType;
    private Difficulty difficulty;
    private String question;
    private String userAnswer;
    private String correctAnswer;
    private String aiEvaluation;
    private int score;
    private int correctnessScore;
    private int reasoningScore;
    private int speedScore;
    private int ratingChange;
    private Instant completedAt;

    public ResultResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public GameType getGameType() { return gameType; }
    public void setGameType(GameType gameType) { this.gameType = gameType; }

    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getUserAnswer() { return userAnswer; }
    public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public String getAiEvaluation() { return aiEvaluation; }
    public void setAiEvaluation(String aiEvaluation) { this.aiEvaluation = aiEvaluation; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getCorrectnessScore() { return correctnessScore; }
    public void setCorrectnessScore(int correctnessScore) { this.correctnessScore = correctnessScore; }

    public int getReasoningScore() { return reasoningScore; }
    public void setReasoningScore(int reasoningScore) { this.reasoningScore = reasoningScore; }

    public int getSpeedScore() { return speedScore; }
    public void setSpeedScore(int speedScore) { this.speedScore = speedScore; }

    public int getRatingChange() { return ratingChange; }
    public void setRatingChange(int ratingChange) { this.ratingChange = ratingChange; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
