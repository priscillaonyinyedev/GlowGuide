package com.glowguide.dto.shopping;

public record CartItemResponse(String productId, String productSlug, String productName,
                               String brandName, String productImageUrl, String officialUrl, String currency,
                               double unitPrice, int quantity, double lineTotal) {}
