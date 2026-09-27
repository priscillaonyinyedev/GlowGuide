package com.glowguide.dto.product;

import com.glowguide.model.ProductCategory;
import com.glowguide.model.SkinConcern;
import com.glowguide.model.SkinType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ProductUpsertRequest(
        @NotBlank @Size(max = 160) String name,
        @Size(max = 180) String slug,
        @NotBlank String brandId,
        @NotNull ProductCategory category,
        @DecimalMin("0.0") double price,
        @NotBlank @Size(min = 3, max = 3) String currency,
        @NotBlank @Size(max = 5000) String description,
        @Size(max = 1000) @Pattern(regexp = "https://[^\\s]+", message = "Official product URL must use HTTPS") String officialUrl,
        @Size(max = 12) List<@Size(max = 500) String> images,
        @Size(max = 30) List<@Size(max = 300) String> benefits,
        @Size(max = 30) List<@Size(max = 300) String> directions,
        @Size(max = 50) List<String> ingredientSlugs,
        @Size(max = 20) List<String> keyIngredientSlugs,
        @Size(max = 5) List<SkinType> suitableSkinTypes,
        @Size(max = 8) List<SkinConcern> targetedConcerns,
        @Size(max = 20) List<@Size(max = 60) String> tags,
        @Size(max = 100) String recommendedRoutineStep,
        @Min(0) int stockQuantity,
        boolean featured,
        boolean active
) {}
