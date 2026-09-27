package com.glowguide.dto.quiz;

import com.glowguide.model.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record QuizSubmitRequest(
        @NotNull SkinType skinType,
        @Size(max = 8) List<SkinConcern> concerns,
        @NotNull SensitivityLevel sensitivity,
        @Size(max = 10) List<String> currentRoutineProducts,
        @Size(max = 20) List<@Size(max = 60) String> productPreferences,
        @Size(max = 10) List<@Size(max = 40) String> routinePreferences,
        @NotNull BudgetRange budget,
        @Size(max = 30) List<@Size(max = 80) String> avoidedIngredients,
        @Min(1) @Max(12) Integer preferredRoutineSteps
) {}
