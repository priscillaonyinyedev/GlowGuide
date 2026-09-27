package com.glowguide.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configurable point values used by RecommendationService. Kept out of the
 * service code so the weighting can be tuned (via application.properties or
 * env vars) without touching business logic.
 */
@Getter
@Setter
@ConfigurationProperties(prefix = "app.recommendation.scoring")
public class RecommendationScoringProperties {

    private int skinTypeMatch = 30;
    private int concernMatchPerItem = 25;
    private int maxConcernMatches = 3;
    private int ingredientMatchPerItem = 20;
    private int maxIngredientMatches = 3;
    private int budgetMatch = 15;
    private int preferenceMatchPerItem = 10;
    private int categoryPreferenceMatch = 10;
    private int routinePreferenceMatch = 10;
    private int maxPreferenceMatches = 2;
    private int sensitivityPenaltyPerCaution = 15;
    private int avoidedIngredientPenalty = 100;
    private int minimumScoreThreshold = 10;
    private int maxResults = 12;
}
