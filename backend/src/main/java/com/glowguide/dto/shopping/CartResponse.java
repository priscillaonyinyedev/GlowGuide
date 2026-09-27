package com.glowguide.dto.shopping;

import java.util.List;

public record CartResponse(String id, List<CartItemResponse> items, double subtotal,
                           double shippingFee, double tax, double total) {}
