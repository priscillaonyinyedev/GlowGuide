package com.glowguide.dto.order;

import com.glowguide.model.Order;
import com.glowguide.model.OrderStatus;

import java.time.Instant;
import java.util.List;

public record AdminOrderResponse(String id, String orderNumber, String userId, List<String> productNames,
                                 double total, OrderStatus status, Instant createdAt) {
    public static AdminOrderResponse from(Order order) {
        return new AdminOrderResponse(order.getId(), order.getOrderNumber(), order.getUserId(),
                order.getItems() == null ? List.of() : order.getItems().stream().map(i -> i.getProductName()).toList(),
                order.getTotal(), order.getStatus(), order.getCreatedAt());
    }
}
