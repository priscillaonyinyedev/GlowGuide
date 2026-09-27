package com.glowguide.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "brands")
public class Brand {

    @Id
    private String id;

    private String name;

    /** URL-safe identifier, e.g. "cerave", used in public URLs like /brands/cerave. */
    @Indexed(unique = true)
    private String slug;

    private String description;
    private String logoUrl;
    private String featuredImageUrl;
    private String countryOfOrigin;

    @Builder.Default
    private boolean demoData = false;
}
