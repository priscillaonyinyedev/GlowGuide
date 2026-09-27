package com.glowguide.dto.ingredient;

import com.glowguide.dto.product.ProductResponse;

import java.util.List;

public record IngredientDetailResponse(
        IngredientResponse ingredient,
        List<IngredientResponse> compatibleIngredients,
        List<IngredientResponse> cautionIngredients,
        List<ProductResponse> products
) {}
