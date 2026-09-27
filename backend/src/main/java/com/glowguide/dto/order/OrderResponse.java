package com.glowguide.dto.order;

import com.glowguide.model.*;

import java.time.Instant;
import java.util.List;

public record OrderResponse(String id, String orderNumber, List<OrderItem> items,
                            double subtotal, double shippingFee, double tax, double total,
                            Address shippingAddress, PaymentInfo payment, OrderStatus status,
                            Instant createdAt) {
    public static OrderResponse from(Order order) {
        return new OrderResponse(order.getId(), order.getOrderNumber(), order.getItems(), order.getSubtotal(),
                order.getShippingFee(), order.getTax(), order.getTotal(), order.getShippingAddress(),
                order.getPayment(), order.getStatus(), order.getCreatedAt());
    }
}
