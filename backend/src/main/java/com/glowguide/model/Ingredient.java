package com.glowguide.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * Educational ingredient library entry. Content here is informational, not
 * medical advice - see ingredientDisclaimer rendered alongside it on the frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ingredients")
public class Ingredient {

    @Id
    private String id;

    private String name;

    /** e.g. "niacinamide" - used for /ingredients/niacinamide */
    @Indexed(unique = true)
    private String slug;

    private String whatItIs;
    private String whatItDoes;
    private List<String> commonUses;
    private List<SkinType> suitableSkinTypes;
    private List<SkinConcern> targetedConcerns;
    private String usageInfo;
    private String irritationConsiderations;

    /** Slugs of other ingredients commonly paired with this one. */
    private List<String> compatibleIngredientSlugs;

    /** Slugs of ingredients that may require caution when combined with this one (educational note, not a hard rule). */
    private List<String> cautionIngredientSlugs;

    private String imageUrl;

    @Builder.Default
    private boolean demoData = false;
}
