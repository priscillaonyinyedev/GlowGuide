package com.glowguide.controller;

import com.glowguide.dto.shopping.WishlistResponse;
import com.glowguide.security.UserPrincipal;
import com.glowguide.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService service;

    @GetMapping
    public WishlistResponse get(@AuthenticationPrincipal UserPrincipal principal) { return service.get(principal.getId()); }

    @PostMapping("/{productId}")
    public WishlistResponse add(@PathVariable String productId, @AuthenticationPrincipal UserPrincipal principal) {
        return service.add(principal.getId(), productId);
    }

    @DeleteMapping("/{productId}")
    public WishlistResponse remove(@PathVariable String productId, @AuthenticationPrincipal UserPrincipal principal) {
        return service.remove(principal.getId(), productId);
    }
}
