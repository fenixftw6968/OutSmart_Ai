package com.outsmartai.backend.dto;

public class HintResponse {
    private String hint;
    private int scorePenaltyPercent = 25;

    public HintResponse(String hint) {
        this.hint = hint;
    }

    public String getHint() { return hint; }
    public int getScorePenaltyPercent() { return scorePenaltyPercent; }
}
