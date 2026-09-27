package com.glowguide.dto.catalog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BrandUpsertRequest(@NotBlank @Size(max = 140) String name, @Size(max = 160) String slug,
                                 @Size(max = 1200) String description, @Size(max = 1000) String logoUrl,
                                 @Size(max = 100) String countryOfOrigin) {}
