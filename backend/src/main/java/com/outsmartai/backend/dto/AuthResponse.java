package com.outsmartai.backend.dto;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private String id;
    private String username;
    private String email;
    private int rating;
    private long totalScore;
    private int gamesPlayed;
    private int bestScore;
    private int currentStreak;
    private long rank;

    public AuthResponse(String token, String id, String username, String email, int rating, long totalScore, int gamesPlayed, int bestScore, int currentStreak, long rank) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.rating = rating;
        this.totalScore = totalScore;
        this.gamesPlayed = gamesPlayed;
        this.bestScore = bestScore;
        this.currentStreak = currentStreak;
        this.rank = rank;
    }

    public String getToken() { return token; }
    public String getTokenType() { return tokenType; }
    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public int getRating() { return rating; }
    public long getTotalScore() { return totalScore; }
    public int getGamesPlayed() { return gamesPlayed; }
    public int getBestScore() { return bestScore; }
    public int getCurrentStreak() { return currentStreak; }
    public long getRank() { return rank; }
}
