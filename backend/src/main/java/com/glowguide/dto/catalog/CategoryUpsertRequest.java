package com.glowguide.dto.catalog;

import com.glowguide.model.ProductCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CategoryUpsertRequest(@NotNull ProductCategory key, @NotBlank @Size(max = 120) String name,
                                    @Size(max = 140) String slug, @Size(max = 1000) String description,
                                    @Size(max = 1000) String imageUrl) {}
