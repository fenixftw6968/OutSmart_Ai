package com.outsmartai.backend.model;

public enum Difficulty {
    EASY(100),
    MEDIUM(150),
    HARD(200),
    EXTREME(300);

    private final int maxScore;

    Difficulty(int maxScore) {
        this.maxScore = maxScore;
    }

    public int getMaxScore() {
        return maxScore;
    }
}
