package com.glowguide.service;

import com.glowguide.dto.shopping.CartItemResponse;
import com.glowguide.dto.shopping.CartResponse;
import com.glowguide.exception.BadRequestException;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.model.Cart;
import com.glowguide.model.CartItem;
import com.glowguide.model.Product;
import com.glowguide.repository.CartRepository;
import com.glowguide.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository carts;
    private final ProductRepository products;

    public CartResponse get(String userId) { return response(load(userId)); }

    public CartResponse add(String userId, String productId, int quantity) {
        Cart cart = load(userId);
        Product product = activeProduct(productId);
        CartItem existing = cart.getItems().stream().filter(item -> item.getProductId().equals(productId)).findFirst().orElse(null);
        int nextQuantity = quantity + (existing == null ? 0 : existing.getQuantity());
        ensureStock(product, nextQuantity);
        if (existing == null) cart.getItems().add(CartItem.builder().productId(productId).quantity(quantity).build());
        else existing.setQuantity(nextQuantity);
        return response(carts.save(cart));
    }

    public CartResponse update(String userId, String productId, int quantity) {
        Cart cart = load(userId);
        CartItem item = cart.getItems().stream().filter(entry -> entry.getProductId().equals(productId)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        ensureStock(activeProduct(productId), quantity);
        item.setQuantity(quantity);
        return response(carts.save(cart));
    }

    public CartResponse remove(String userId, String productId) {
        Cart cart = load(userId);
        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        return response(carts.save(cart));
    }

    public CartResponse clear(String userId) {
        Cart cart = load(userId);
        cart.getItems().clear();
        return response(carts.save(cart));
    }

    private Cart load(String userId) {
        return carts.findByUserId(userId).orElseGet(() -> carts.save(Cart.builder().userId(userId).items(new ArrayList<>()).build()));
    }

    private Product activeProduct(String id) {
        return products.findById(id).filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private void ensureStock(Product product, int quantity) {
        if (quantity < 1 || quantity > 20) throw new BadRequestException("Quantity must be between 1 and 20");
    }

    private CartResponse response(Cart cart) {
        List<CartItemResponse> items = new ArrayList<>();
        double subtotal = 0;
        for (CartItem item : cart.getItems()) {
            Product product = products.findById(item.getProductId()).filter(Product::isActive).orElse(null);
            if (product == null) continue;
            double lineTotal = round(product.getPrice() * item.getQuantity());
            subtotal += lineTotal;
            String image = product.getImages() == null || product.getImages().isEmpty() ? null : product.getImages().get(0);
            items.add(new CartItemResponse(product.getId(), product.getSlug(), product.getName(), product.getBrandName(),
                    image, product.getOfficialUrl(), product.getCurrency(), product.getPrice(), item.getQuantity(), lineTotal));
        }
        subtotal = round(subtotal);
        return new CartResponse(cart.getId(), items, subtotal, 0, 0, subtotal);
    }

    static double round(double amount) { return Math.round(amount * 100.0) / 100.0; }
}
