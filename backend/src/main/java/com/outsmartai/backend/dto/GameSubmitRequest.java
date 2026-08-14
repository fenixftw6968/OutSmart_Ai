package com.outsmartai.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class GameSubmitRequest {
    @NotBlank(message = "Answer is required")
    private String userAnswer;

    public GameSubmitRequest() {}

    public String getUserAnswer() { return userAnswer; }
    public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }
}
