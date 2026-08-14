package com.outsmartai.backend.dto;

public class LeaderboardEntry {
    private long rank;
    private String userId;
    private String username;
    private long totalScore;
    private int rating;
    private int gamesPlayed;
    private int gamesWon;
    private int bestScore;
    private int currentStreak;
    private boolean isCurrentUser;

    public LeaderboardEntry() {}

    public LeaderboardEntry(long rank, String userId, String username, long totalScore, int rating, int gamesPlayed, int gamesWon, int bestScore, int currentStreak, boolean isCurrentUser) {
        this.rank = rank;
        this.userId = userId;
        this.username = username;
        this.totalScore = totalScore;
        this.rating = rating;
        this.gamesPlayed = gamesPlayed;
        this.gamesWon = gamesWon;
        this.bestScore = bestScore;
        this.currentStreak = currentStreak;
        this.isCurrentUser = isCurrentUser;
    }

    public long getRank() { return rank; }
    public String getUserId() { return userId; }
    public String getUsername() { return username; }
    public long getTotalScore() { return totalScore; }
    public int getRating() { return rating; }
    public int getGamesPlayed() { return gamesPlayed; }
    public int getGamesWon() { return gamesWon; }
    public int getBestScore() { return bestScore; }
    public int getCurrentStreak() { return currentStreak; }
    public boolean isCurrentUser() { return isCurrentUser; }
    public void setCurrentUser(boolean currentUser) { isCurrentUser = currentUser; }
}
