package com.glowguide.repository;

import com.glowguide.model.ProductCategory;
import com.glowguide.model.SkinConcern;
import com.glowguide.model.SkinType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Plain holder for every optional Shop-page filter. Passed into
 * ProductRepositoryCustom#search so the dynamic Criteria query stays in one
 * place instead of scattered derived-query methods.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductFilter {
    private String keyword;
    private List<String> keywordIngredientSlugs;
    private List<String> brandSlugs;
    private List<ProductCategory> categories;
    private List<SkinType> skinTypes;
    private List<SkinConcern> concerns;
    private List<String> ingredientSlugs;
    private Double minPrice;
    private Double maxPrice;
    private Double minRating;
    private Boolean featuredOnly;
}
