package com.glowguide.dto.user;

import com.glowguide.model.BudgetRange;
import com.glowguide.model.SkinConcern;
import com.glowguide.model.SkinType;
import com.glowguide.model.SensitivityLevel;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

import java.util.List;

public record SkinProfileUpdateRequest(SkinType skinType, @Size(max = 8) List<SkinConcern> concerns,
                                       BudgetRange budget, SensitivityLevel sensitivity,
                                       @Size(max = 30) List<@Size(max = 80) String> avoidedIngredients,
                                       @Min(1) @Max(12) Integer preferredRoutineSteps) {}
