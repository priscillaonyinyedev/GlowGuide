package com.glowguide.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    private String name;

    /** e.g. "beauty-of-joseon-glow-serum" - used for /products/{slug} */
    @Indexed(unique = true)
    private String slug;

    /** Reference to Brand._id. Brand name/slug are denormalized below to avoid a join on every product listing. */
    private String brandId;
    private String brandName;
    private String brandSlug;

    private ProductCategory category;

    private double price;
    private String currency;

    @Builder.Default
    private List<String> images = List.of();

    private String description;
    /** Official manufacturer page for product and ingredient verification. */
    private String officialUrl;
    private List<String> benefits;
    private List<String> directions;

    /** Ingredient slugs, in the order they appear on the product's ingredient list. */
    @Builder.Default
    private List<String> ingredientSlugs = List.of();

    /** Ingredient slugs called out as the product's key/active ingredients (used heavily by the recommendation engine). */
    @Builder.Default
    private List<String> keyIngredientSlugs = List.of();

    @Builder.Default
    private List<SkinType> suitableSkinTypes = List.of();

    @Builder.Default
    private List<SkinConcern> targetedConcerns = List.of();

    /** Catalog labels used for non-medical user preference matching (e.g. vegan, fragrance-free). */
    @Builder.Default
    private List<String> tags = List.of();

    /** Where this product typically sits in a routine, e.g. "Step 3 - Serum". */
    private String recommendedRoutineStep;

    @Field("averageRating")
    @Builder.Default
    private double averageRating = 0.0;

    @Builder.Default
    private int reviewCount = 0;

    @Builder.Default
    private int stockQuantity = 0;

    @Builder.Default
    private boolean featured = false;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private boolean demoData = false;

    @CreatedDate
    private Instant createdAt;
}
