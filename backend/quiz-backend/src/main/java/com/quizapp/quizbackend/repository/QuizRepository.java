package com.quizapp.quizbackend.repository;

import com.quizapp.quizbackend.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
}
