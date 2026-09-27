package com.glowguide.dto.product;

import com.glowguide.dto.ingredient.IngredientResponse;

import java.util.List;

public record ProductDetailResponse(
        ProductResponse product,
        List<IngredientResponse> relatedIngredients,
        List<ProductResponse> relatedProducts
) {}
