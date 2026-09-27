package com.glowguide.dto.quiz;

import com.glowguide.model.*;

import java.time.Instant;
import java.util.List;

public record QuizResultResponse(
        String id, SkinType skinType, List<SkinConcern> concerns,
        SensitivityLevel sensitivity, List<String> currentRoutineProducts,
        List<String> productPreferences, List<String> routinePreferences, BudgetRange budget,
        List<String> avoidedIngredients, Integer preferredRoutineSteps,
        Instant createdAt
) {
    public static QuizResultResponse from(QuizResult result) {
        return new QuizResultResponse(result.getId(), result.getSkinType(), result.getConcerns(), result.getSensitivity(),
                result.getCurrentRoutineProducts(), result.getProductPreferences(), result.getRoutinePreferences(), result.getBudget(),
                result.getAvoidedIngredients(), result.getPreferredRoutineSteps(), result.getCreatedAt());
    }
}
