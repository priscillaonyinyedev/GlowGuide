package com.glowguide.dto.ingredient;

import com.glowguide.model.SkinConcern;
import com.glowguide.model.SkinType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record IngredientUpsertRequest(
        @NotBlank @Size(max = 120) String name,
        @Size(max = 140) String slug,
        @NotBlank @Size(max = 800) String whatItIs,
        @NotBlank @Size(max = 1200) String whatItDoes,
        @Size(max = 20) List<@Size(max = 240) String> commonUses,
        @Size(max = 5) List<SkinType> suitableSkinTypes,
        @Size(max = 8) List<SkinConcern> targetedConcerns,
        @Size(max = 1200) String usageInfo,
        @Size(max = 1200) String irritationConsiderations,
        @Size(max = 30) List<String> compatibleIngredientSlugs,
        @Size(max = 30) List<String> cautionIngredientSlugs,
        @Size(max = 1000) String imageUrl
) {}
