package com.glowguide.controller;

import com.glowguide.dto.catalog.CategoryResponse;
import com.glowguide.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CatalogService catalog;

    @GetMapping
    public List<CategoryResponse> list() { return catalog.categories(); }

    @GetMapping("/{slug}")
    public CategoryResponse get(@PathVariable String slug) { return catalog.category(slug); }
}
