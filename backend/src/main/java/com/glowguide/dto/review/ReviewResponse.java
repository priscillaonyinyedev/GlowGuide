package com.glowguide.dto.review;

import com.glowguide.model.Review;
import com.glowguide.model.ReviewStatus;

import java.time.Instant;

public record ReviewResponse(String id, String productId, String productSlug, String productName,
                             String userId, String userName, String userProfileImageUrl,
                             int rating, String text, ReviewStatus status, Instant createdAt) {
    public static ReviewResponse from(Review review, String productSlug, String productName) {
        return new ReviewResponse(review.getId(), review.getProductId(), productSlug, productName,
                review.getUserId(), review.getUserName(), review.getUserProfileImageUrl(),
                review.getRating(), review.getText(), review.getStatus(), review.getCreatedAt());
    }
}
