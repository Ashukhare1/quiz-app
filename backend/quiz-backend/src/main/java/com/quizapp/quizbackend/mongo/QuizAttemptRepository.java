package com.quizapp.quizbackend.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface QuizAttemptRepository extends MongoRepository<QuizAttempt, String> {
    List<QuizAttempt> findByQuizId(Long quizId);
    List<QuizAttempt> findByUserName(String userName);
}
