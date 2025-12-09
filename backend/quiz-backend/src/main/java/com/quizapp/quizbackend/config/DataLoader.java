package com.quizapp.quizbackend.config;

import com.quizapp.quizbackend.model.Question;
import com.quizapp.quizbackend.model.Quiz;
import com.quizapp.quizbackend.repository.QuestionRepository;
import com.quizapp.quizbackend.repository.QuizRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner loadData(QuizRepository quizRepository,
                                      QuestionRepository questionRepository) {
        return args -> {
            if (quizRepository.count() > 0) return; // Don't repeat insert

            Quiz quiz = new Quiz();
            quiz.setTitle("Java Basics");
            quiz.setDescription("Test your basic Java knowledge");
            quiz.setDurationSeconds(60); // 1 minute timer
            quiz = quizRepository.save(quiz);

            Question q1 = new Question();
            q1.setQuiz(quiz);
            q1.setQuestionText("Which keyword is used to create a subclass in Java?");
            q1.setOptionA("extends");
            q1.setOptionB("implements");
            q1.setOptionC("inherit");
            q1.setOptionD("super");
            q1.setCorrectOption("A");

            Question q2 = new Question();
            q2.setQuiz(quiz);
            q2.setQuestionText("Which of these is not a Java primitive type?");
            q2.setOptionA("int");
            q2.setOptionB("String");
            q2.setOptionC("boolean");
            q2.setOptionD("double");
            q2.setCorrectOption("B");

            Question q3 = new Question();
            q3.setQuiz(quiz);
            q3.setQuestionText("Which method is the entry point of a Java application?");
            q3.setOptionA("start()");
            q3.setOptionB("run()");
            q3.setOptionC("main()");
            q3.setOptionD("init()");
            q3.setCorrectOption("C");

            questionRepository.saveAll(Arrays.asList(q1, q2, q3));

            System.out.println("Quiz data loaded successfully 🚀");
        };
    }
}
