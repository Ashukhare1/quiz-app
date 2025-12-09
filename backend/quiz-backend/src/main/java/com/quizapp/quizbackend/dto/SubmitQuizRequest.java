package com.quizapp.quizbackend.dto;

import java.util.Map;

public class SubmitQuizRequest {
    private String userName;
    private Map<Long, String> answers; // questionId -> chosenOption

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public Map<Long, String> getAnswers() { return answers; }
    public void setAnswers(Map<Long, String> answers) { this.answers = answers; }
}
