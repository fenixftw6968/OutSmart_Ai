package com.outsmartai.backend.dto;

import com.outsmartai.backend.model.Difficulty;
import com.outsmartai.backend.model.GameType;

public class GameStartRequest {
    private GameType gameType = GameType.LOGIC;
    private Difficulty difficulty = Difficulty.MEDIUM;
    private boolean isDaily = false;

    public GameStartRequest() {}

    public GameType getGameType() { return gameType; }
    public void setGameType(GameType gameType) { this.gameType = gameType; }

    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }

    public boolean isDaily() { return isDaily; }
    public void setDaily(boolean daily) { isDaily = daily; }
}
