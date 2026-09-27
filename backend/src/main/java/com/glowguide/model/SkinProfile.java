package com.glowguide.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Embedded (not a separate collection) snapshot of a user's skin profile,
 * derived from their most recent skin quiz submission or manual profile edits.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkinProfile {
    private SkinType skinType;
    private List<SkinConcern> concerns;
    private SensitivityLevel sensitivity;
    private BudgetRange budget;
    private List<String> avoidedIngredients;
    private List<String> routinePreferences;
    private Integer preferredRoutineSteps;
}
