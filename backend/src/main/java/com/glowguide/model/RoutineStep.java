package com.glowguide.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** One product placed at a given position within a routine. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoutineStep {
    private int order;
    private String productId;
    private String productName;
    private String productImageUrl;
    private ProductCategory category;
}
