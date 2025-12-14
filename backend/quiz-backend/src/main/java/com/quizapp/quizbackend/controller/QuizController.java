package com.quizapp.quizbackend.controller;

import com.quizapp.quizbackend.dto.SubmitQuizRequest;
import com.quizapp.quizbackend.dto.SubmitQuizResponse;
import com.quizapp.quizbackend.model.Question;
import com.quizapp.quizbackend.model.Quiz;
import com.quizapp.quizbackend.mongo.QuizAttempt;
import com.quizapp.quizbackend.mongo.QuizAttemptRepository;
import com.quizapp.quizbackend.repository.QuestionRepository;
import com.quizapp.quizbackend.repository.QuizRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

// @RestController
// @RequestMapping("/api/quizzes")
// @CrossOrigin(origins = "http://localhost:5173")
// public class QuizController {
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/quizzes")
public class QuizController {


    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public QuizController(QuizRepository quizRepository, QuestionRepository questionRepository,
                          QuizAttemptRepository quizAttemptRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.quizAttemptRepository = quizAttemptRepository;
    }

    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    @GetMapping("/{id}/questions")
    public List<Question> getQuestions(@PathVariable Long id) {
        return questionRepository.findByQuizId(id);
    }

    @PostMapping("/{id}/submit")
    public SubmitQuizResponse submitQuiz(@PathVariable Long id, @RequestBody SubmitQuizRequest request) {
        List<Question> questions = questionRepository.findByQuizId(id);
        int score = 0;
        for (Question q : questions) {
            String chosen = request.getAnswers().get(q.getId());
            if (chosen != null && chosen.equalsIgnoreCase(q.getCorrectOption())) {
                score++;
            }
        }

        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuizId(id);
        attempt.setUserName(request.getUserName());
        attempt.setScore(score);
        attempt.setTotalQuestions(questions.size());
        attempt.setAttemptedAt(LocalDateTime.now());
        attempt.setAnswers(request.getAnswers());
        quizAttemptRepository.save(attempt);

        return new SubmitQuizResponse(score, questions.size());
    }
}
