package com.glowguide.repository;

import com.glowguide.model.Review;
import com.glowguide.model.ReviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends MongoRepository<Review, String> {
    Page<Review> findByProductIdAndStatus(String productId, ReviewStatus status, Pageable pageable);
    List<Review> findByProductIdAndStatus(String productId, ReviewStatus status);
    Optional<Review> findByProductIdAndUserId(String productId, String userId);
    Page<Review> findByStatus(ReviewStatus status, Pageable pageable);
    Page<Review> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<Review> findByUserIdOrderByCreatedAtDesc(String userId);
    void deleteByUserId(String userId);
}
