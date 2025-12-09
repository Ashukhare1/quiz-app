package com.quizapp.quizbackend.dto;

public class SubmitQuizResponse {
    private int score;
    private int totalQuestions;

    public SubmitQuizResponse(int score, int totalQuestions) {
        this.score = score;
        this.totalQuestions = totalQuestions;
    }

    public int getScore() { return score; }
    public int getTotalQuestions() { return totalQuestions; }
}
