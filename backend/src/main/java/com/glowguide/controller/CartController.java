package com.glowguide.controller;

import com.glowguide.dto.shopping.CartItemRequest;
import com.glowguide.dto.shopping.CartResponse;
import com.glowguide.dto.shopping.QuantityRequest;
import com.glowguide.security.UserPrincipal;
import com.glowguide.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService service;

    @GetMapping
    public CartResponse get(@AuthenticationPrincipal UserPrincipal principal) { return service.get(principal.getId()); }

    @PostMapping("/items")
    public CartResponse add(@Valid @RequestBody CartItemRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        return service.add(principal.getId(), request.productId(), request.quantity());
    }

    @PutMapping("/items/{productId}")
    public CartResponse update(@PathVariable String productId, @Valid @RequestBody QuantityRequest request,
                               @AuthenticationPrincipal UserPrincipal principal) {
        return service.update(principal.getId(), productId, request.quantity());
    }

    @DeleteMapping("/items/{productId}")
    public CartResponse remove(@PathVariable String productId, @AuthenticationPrincipal UserPrincipal principal) {
        return service.remove(principal.getId(), productId);
    }

    @DeleteMapping
    public CartResponse clear(@AuthenticationPrincipal UserPrincipal principal) { return service.clear(principal.getId()); }
}
