package com.glowguide.controller;

import com.glowguide.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminOverviewController {
    private final ProductRepository products;
    private final IngredientRepository ingredients;
    private final UserRepository users;
    private final OrderRepository orders;
    private final ReviewRepository reviews;

    @GetMapping("/overview")
    public Map<String, Long> overview() {
        return Map.of("products", products.count(), "ingredients", ingredients.count(),
                "users", users.count(), "orders", orders.count(), "reviews", reviews.count());
    }
}
