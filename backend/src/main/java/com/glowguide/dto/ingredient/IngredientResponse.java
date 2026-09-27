package com.glowguide.dto.ingredient;

import com.glowguide.model.Ingredient;
import com.glowguide.model.SkinConcern;
import com.glowguide.model.SkinType;

import java.util.List;

public record IngredientResponse(
        String id, String name, String slug, String whatItIs, String whatItDoes,
        List<String> commonUses, List<SkinType> suitableSkinTypes,
        List<SkinConcern> targetedConcerns, String usageInfo,
        String irritationConsiderations, List<String> compatibleIngredientSlugs,
        List<String> cautionIngredientSlugs, String imageUrl, boolean demoData
) {
    public static IngredientResponse from(Ingredient ingredient) {
        return new IngredientResponse(ingredient.getId(), ingredient.getName(), ingredient.getSlug(),
                ingredient.getWhatItIs(), ingredient.getWhatItDoes(), ingredient.getCommonUses(),
                ingredient.getSuitableSkinTypes(), ingredient.getTargetedConcerns(), ingredient.getUsageInfo(),
                ingredient.getIrritationConsiderations(), ingredient.getCompatibleIngredientSlugs(),
                ingredient.getCautionIngredientSlugs(), ingredient.getImageUrl(), ingredient.isDemoData());
    }
}
