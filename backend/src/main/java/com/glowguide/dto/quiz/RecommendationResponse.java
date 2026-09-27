package com.glowguide.dto.quiz;

import com.glowguide.dto.product.ProductResponse;

import java.util.List;

public record RecommendationResponse(QuizResultResponse quizResult, List<Recommendation> recommendations) {
    public record Recommendation(ProductResponse product, int score, String reason) {}
}
