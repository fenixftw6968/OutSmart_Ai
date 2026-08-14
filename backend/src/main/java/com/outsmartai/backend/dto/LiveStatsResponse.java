package com.outsmartai.backend.dto;

public class LiveStatsResponse {
    private long activeGames;
    private long gamesCompletedToday;
    private long registeredPlayers;

    public LiveStatsResponse(long activeGames, long gamesCompletedToday, long registeredPlayers) {
        this.activeGames = activeGames;
        this.gamesCompletedToday = gamesCompletedToday;
        this.registeredPlayers = registeredPlayers;
    }

    public long getActiveGames() { return activeGames; }
    public long getGamesCompletedToday() { return gamesCompletedToday; }
    public long getRegisteredPlayers() { return registeredPlayers; }
}
