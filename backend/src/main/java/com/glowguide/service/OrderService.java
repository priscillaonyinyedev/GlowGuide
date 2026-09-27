package com.glowguide.service;

import com.glowguide.dto.order.OrderCheckoutRequest;
import com.glowguide.dto.order.OrderResponse;
import com.glowguide.dto.order.AdminOrderResponse;
import com.glowguide.exception.BadRequestException;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.model.*;
import com.glowguide.repository.CartRepository;
import com.glowguide.repository.OrderRepository;
import com.glowguide.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orders;
    private final CartRepository carts;
    private final ProductRepository products;

    public OrderResponse checkout(String userId, OrderCheckoutRequest request) {
        Cart cart = carts.findByUserId(userId).orElseThrow(() -> new BadRequestException("Your cart is empty"));
        if (cart.getItems() == null || cart.getItems().isEmpty()) throw new BadRequestException("Your cart is empty");

        List<OrderItem> items = cart.getItems().stream().map(item -> {
            Product product = products.findById(item.getProductId()).filter(Product::isActive)
                    .orElseThrow(() -> new BadRequestException("A cart product is no longer available"));
            if (item.getQuantity() > product.getStockQuantity()) throw new BadRequestException("There is not enough stock for " + product.getName());
            double lineTotal = CartService.round(product.getPrice() * item.getQuantity());
            String image = product.getImages() == null || product.getImages().isEmpty() ? null : product.getImages().get(0);
            return OrderItem.builder().productId(product.getId()).productName(product.getName()).productImageUrl(image)
                    .unitPrice(product.getPrice()).quantity(item.getQuantity()).lineTotal(lineTotal).build();
        }).toList();

        double subtotal = CartService.round(items.stream().mapToDouble(OrderItem::getLineTotal).sum());
        double shippingFee = 0;
        double tax = 0;
        PaymentRequestData paymentData = paymentData(request);
        Order order = Order.builder().userId(userId).orderNumber(orderNumber()).items(items)
                .subtotal(subtotal).shippingFee(shippingFee).tax(tax).total(CartService.round(subtotal + shippingFee + tax))
                .shippingAddress(toAddress(request.shippingAddress()))
                .payment(PaymentInfo.builder().provider(paymentData.provider).providerPaymentId(paymentData.paymentId)
                        .cardBrand(paymentData.cardBrand).last4(paymentData.last4).status(PaymentStatus.PENDING).build())
                .status(OrderStatus.PENDING).build();
        Order saved = orders.save(order);
        cart.getItems().clear();
        carts.save(cart);
        return OrderResponse.from(saved);
    }

    public List<OrderResponse> mine(String userId) {
        return orders.findByUserIdOrderByCreatedAtDesc(userId).stream().map(OrderResponse::from).toList();
    }

    public Page<AdminOrderResponse> adminList(int page, int size) {
        return orders.findAllByOrderByCreatedAtDesc(PageRequest.of(Math.max(page, 0), Math.max(1, Math.min(size, 100))))
                .map(AdminOrderResponse::from);
    }

    public AdminOrderResponse updateStatus(String id, OrderStatus status) {
        Order order = orders.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (order.getPayment() != null && order.getPayment().getStatus() == PaymentStatus.PENDING
                && status != OrderStatus.PENDING && status != OrderStatus.CANCELLED) {
            throw new BadRequestException("An unpaid order cannot be processed or shipped");
        }
        order.setStatus(status);
        return AdminOrderResponse.from(orders.save(order));
    }

    public OrderResponse get(String id, String userId) {
        return orders.findByIdAndUserId(id, userId).map(OrderResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    private Address toAddress(com.glowguide.dto.order.AddressRequest value) {
        return Address.builder().fullName(value.fullName().trim()).line1(value.line1().trim())
                .line2(value.line2() == null ? null : value.line2().trim()).city(value.city().trim())
                .state(value.state().trim()).postalCode(value.postalCode().trim()).country(value.country().trim())
                .phone(value.phone().trim()).build();
    }

    private PaymentRequestData paymentData(OrderCheckoutRequest request) {
        if (request.payment() == null) return new PaymentRequestData("demo", null, null, null);
        String provider = request.payment().provider() == null ? "demo" : request.payment().provider().trim().toLowerCase(Locale.ROOT);
        if (!provider.equals("demo")) throw new BadRequestException("This checkout currently supports demo orders only; a payment provider must be integrated before taking payment");
        return new PaymentRequestData("demo", null, clean(request.payment().cardBrand()), clean(request.payment().last4()));
    }

    private String clean(String value) { return value == null || value.isBlank() ? null : value.trim(); }

    private String orderNumber() {
        return "GG-" + LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE) + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase(Locale.ROOT);
    }

    private record PaymentRequestData(String provider, String paymentId, String cardBrand, String last4) {}
}
