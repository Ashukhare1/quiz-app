package com.quizapp.quizbackend.dto;

import com.quizapp.quizbackend.model.Question;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

public class QuestionResponse {
    private Long id;
    private String text;
    private Map<String, String> options; // {"A": "extends", "B": "implements", ...}
    private String correctOption;

    public QuestionResponse(Question question) {
        this.id = question.getId();
        this.text = question.getQuestionText();
        this.options = new LinkedHashMap<>();
        this.options.put("A", question.getOptionA());
        this.options.put("B", question.getOptionB());
        this.options.put("C", question.getOptionC());
        this.options.put("D", question.getOptionD());
        this.correctOption = question.getCorrectOption();
    }

    public Long getId() { return id; }
    public String getText() { return text; }
    public Map<String, String> getOptions() { return options; }
    public String getCorrectOption() { return correctOption; }
}
