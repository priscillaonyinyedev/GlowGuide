package com.glowguide.dto.product;

import com.glowguide.model.Product;
import com.glowguide.model.ProductCategory;
import com.glowguide.model.SkinConcern;
import com.glowguide.model.SkinType;

import java.util.List;

public record ProductResponse(
        String id, String name, String slug, String brandId, String brandName, String brandSlug,
        ProductCategory category, double price, String currency, List<String> images,
        String description, String officialUrl, List<String> benefits, List<String> directions,
        List<String> ingredientSlugs, List<String> keyIngredientSlugs,
        List<SkinType> suitableSkinTypes, List<SkinConcern> targetedConcerns,
        List<String> tags, String recommendedRoutineStep, double averageRating, int reviewCount,
        int stockQuantity, boolean featured, boolean active, boolean demoData
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(product.getId(), product.getName(), product.getSlug(), product.getBrandId(),
                product.getBrandName(), product.getBrandSlug(), product.getCategory(), product.getPrice(),
                product.getCurrency(), product.getImages(), product.getDescription(), product.getOfficialUrl(), product.getBenefits(),
                product.getDirections(), product.getIngredientSlugs(), product.getKeyIngredientSlugs(),
                product.getSuitableSkinTypes(), product.getTargetedConcerns(), product.getTags(), product.getRecommendedRoutineStep(),
                product.getAverageRating(), product.getReviewCount(), product.getStockQuantity(), product.isFeatured(), product.isActive(), product.isDemoData());
    }
}
