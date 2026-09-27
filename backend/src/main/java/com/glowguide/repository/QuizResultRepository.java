package com.glowguide.repository;

import com.glowguide.model.QuizResult;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface QuizResultRepository extends MongoRepository<QuizResult, String> {
    List<QuizResult> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<QuizResult> findTopByUserIdOrderByCreatedAtDesc(String userId);
    void deleteByUserId(String userId);
}
