package com.glowguide.dto.shopping;

import com.glowguide.dto.product.ProductResponse;

import java.util.List;

public record WishlistResponse(List<String> productIds, List<ProductResponse> products) {}
