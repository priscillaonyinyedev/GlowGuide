package com.glowguide.controller;

import com.glowguide.dto.ingredient.IngredientDetailResponse;
import com.glowguide.dto.ingredient.IngredientResponse;
import com.glowguide.model.SkinConcern;
import com.glowguide.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
public class IngredientController {
    private final CatalogService catalog;

    @GetMapping
    public Page<IngredientResponse> list(@RequestParam(required = false) String q,
                                         @RequestParam(required = false) SkinConcern concern,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "24") int size) {
        return catalog.ingredients(q, concern, page, size);
    }

    @GetMapping("/{slug}")
    public IngredientDetailResponse get(@PathVariable String slug) { return catalog.ingredient(slug); }
}
