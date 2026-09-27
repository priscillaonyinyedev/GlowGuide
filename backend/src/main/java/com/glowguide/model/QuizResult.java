package com.glowguide.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

/** A single submission of the Skin Quiz, kept so users can review past results and so the profile can evolve over time. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "quiz_results")
public class QuizResult {

    @Id
    private String id;

    @Indexed
    private String userId;

    private SkinType skinType;
    private List<SkinConcern> concerns;
    private SensitivityLevel sensitivity;
    private List<String> currentRoutineProducts;
    private List<String> productPreferences;
    private List<String> routinePreferences;
    private BudgetRange budget;
    private List<String> avoidedIngredients;
    private Integer preferredRoutineSteps;

    @CreatedDate
    private Instant createdAt;
}
