package com.glowguide.dto.catalog;

import com.glowguide.model.Category;
import com.glowguide.model.ProductCategory;

public record CategoryResponse(String id, ProductCategory key, String name, String slug, String description, String imageUrl, boolean demoData) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(category.getId(), category.getKey(), category.getName(), category.getSlug(), category.getDescription(), category.getImageUrl(), category.isDemoData());
    }
}
