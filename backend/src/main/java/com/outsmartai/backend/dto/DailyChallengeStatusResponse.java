package com.outsmartai.backend.dto;

public class DailyChallengeStatusResponse {
    private boolean completedToday;
    private long totalAttemptsToday;
    private int averageScoreToday;
    private String title;
    private String description;

    public DailyChallengeStatusResponse(boolean completedToday, long totalAttemptsToday, int averageScoreToday, String title, String description) {
        this.completedToday = completedToday;
        this.totalAttemptsToday = totalAttemptsToday;
        this.averageScoreToday = averageScoreToday;
        this.title = title;
        this.description = description;
    }

    public boolean isCompletedToday() { return completedToday; }
    public long getTotalAttemptsToday() { return totalAttemptsToday; }
    public int getAverageScoreToday() { return averageScoreToday; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
}
