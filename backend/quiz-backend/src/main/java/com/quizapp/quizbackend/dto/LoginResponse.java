package com.quizapp.quizbackend.dto;

public class LoginResponse {
    private Long id;
    private String username;

    public LoginResponse(Long id, String username) {
        this.id = id;
        this.username = username;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
}
