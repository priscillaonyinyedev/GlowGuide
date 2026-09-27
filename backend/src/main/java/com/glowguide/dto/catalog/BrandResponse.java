package com.glowguide.dto.catalog;

import com.glowguide.model.Brand;

public record BrandResponse(String id, String name, String slug, String description, String logoUrl, String featuredImageUrl, String countryOfOrigin, boolean demoData) {
    public static BrandResponse from(Brand brand) {
        return new BrandResponse(brand.getId(), brand.getName(), brand.getSlug(), brand.getDescription(), brand.getLogoUrl(), brand.getFeaturedImageUrl(), brand.getCountryOfOrigin(), brand.isDemoData());
    }
}
