package com.glowguide.service;

import com.glowguide.dto.product.ProductResponse;
import com.glowguide.dto.shopping.WishlistResponse;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.model.Product;
import com.glowguide.model.Wishlist;
import com.glowguide.repository.ProductRepository;
import com.glowguide.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {
    private final WishlistRepository wishlists;
    private final ProductRepository products;

    public WishlistResponse get(String userId) { return response(load(userId)); }

    public WishlistResponse add(String userId, String productId) {
        ensureProduct(productId);
        Wishlist wishlist = load(userId);
        wishlist.getProductIds().add(productId);
        return response(wishlists.save(wishlist));
    }

    public WishlistResponse remove(String userId, String productId) {
        Wishlist wishlist = load(userId);
        wishlist.getProductIds().remove(productId);
        return response(wishlists.save(wishlist));
    }

    private Wishlist load(String userId) {
        return wishlists.findByUserId(userId).orElseGet(() -> wishlists.save(Wishlist.builder().userId(userId).productIds(new LinkedHashSet<>()).build()));
    }

    private Product ensureProduct(String id) {
        return products.findById(id).filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private WishlistResponse response(Wishlist wishlist) {
        List<ProductResponse> savedProducts = products.findByIdIn(List.copyOf(wishlist.getProductIds())).stream()
                .filter(Product::isActive).map(ProductResponse::from).toList();
        return new WishlistResponse(List.copyOf(wishlist.getProductIds()), savedProducts);
    }
}
