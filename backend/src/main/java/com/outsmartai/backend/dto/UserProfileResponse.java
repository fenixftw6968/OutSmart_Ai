package com.outsmartai.backend.dto;

import com.outsmartai.backend.model.GameSession;
import java.util.List;

public class UserProfileResponse {
    private String id;
    private String username;
    private String email;
    private int rating;
    private long totalScore;
    private int gamesPlayed;
    private int gamesWon;
    private double winRate;
    private int bestScore;
    private int currentStreak;
    private int bestStreak;
    private long globalRank;
    private boolean dailyChallengeCompletedToday;
    private List<GameSession> recentGames;

    public UserProfileResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public long getTotalScore() { return totalScore; }
    public void setTotalScore(long totalScore) { this.totalScore = totalScore; }

    public int getGamesPlayed() { return gamesPlayed; }
    public void setGamesPlayed(int gamesPlayed) { this.gamesPlayed = gamesPlayed; }

    public int getGamesWon() { return gamesWon; }
    public void setGamesWon(int gamesWon) { this.gamesWon = gamesWon; }

    public double getWinRate() { return winRate; }
    public void setWinRate(double winRate) { this.winRate = winRate; }

    public int getBestScore() { return bestScore; }
    public void setBestScore(int bestScore) { this.bestScore = bestScore; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public int getBestStreak() { return bestStreak; }
    public void setBestStreak(int bestStreak) { this.bestStreak = bestStreak; }

    public long getGlobalRank() { return globalRank; }
    public void setGlobalRank(long globalRank) { this.globalRank = globalRank; }

    public boolean isDailyChallengeCompletedToday() { return dailyChallengeCompletedToday; }
    public void setDailyChallengeCompletedToday(boolean dailyChallengeCompletedToday) { this.dailyChallengeCompletedToday = dailyChallengeCompletedToday; }

    public List<GameSession> getRecentGames() { return recentGames; }
    public void setRecentGames(List<GameSession> recentGames) { this.recentGames = recentGames; }
}
