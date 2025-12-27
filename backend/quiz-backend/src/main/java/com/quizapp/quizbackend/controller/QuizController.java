package com.quizapp.quizbackend.controller;

import com.quizapp.quizbackend.model.Quiz;
import com.quizapp.quizbackend.repository.QuizRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "*")
public class QuizController {

    private final QuizRepository quizRepository;

    public QuizController(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    // ✅ Get all quizzes
    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    // ✅ Get quiz by id
    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable Long id) {
        return quizRepository.findById(id).orElse(null);
    }

    // ✅ Create new quiz
    @PostMapping
    public Quiz createQuiz(@RequestBody Quiz quiz) {
        return quizRepository.save(quiz);
    }

    // ✅ Delete quiz
    @DeleteMapping("/{id}")
    public void deleteQuiz(@PathVariable Long id) {
        quizRepository.deleteById(id);
    }
}
