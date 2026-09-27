package com.glowguide.dto.assistant;

import com.glowguide.dto.ingredient.IngredientResponse;
import com.glowguide.dto.quiz.RecommendationResponse;

import java.util.List;

public record AssistantResponse(String answer, String disclaimer, List<IngredientResponse> ingredients,
                                List<RecommendationResponse.Recommendation> recommendations) {}
