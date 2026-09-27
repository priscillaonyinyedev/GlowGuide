package com.glowguide.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Snapshot of a product at the time of purchase, so later price/name edits don't rewrite order history. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private String productId;
    private String productName;
    private String productImageUrl;
    private double unitPrice;
    private int quantity;
    private double lineTotal;
}
