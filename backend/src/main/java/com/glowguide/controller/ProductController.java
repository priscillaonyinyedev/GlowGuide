package com.glowguide.controller;

import com.glowguide.dto.product.ProductDetailResponse;
import com.glowguide.dto.product.ProductResponse;
import com.glowguide.model.ProductCategory;
import com.glowguide.model.SkinConcern;
import com.glowguide.model.SkinType;
import com.glowguide.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService service;

    @GetMapping
    public Page<ProductResponse> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) ProductCategory category,
            @RequestParam(required = false) SkinType skinType,
            @RequestParam(required = false) SkinConcern concern,
            @RequestParam(required = false) String ingredient,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "featured") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        return service.search(q, brand, category, skinType, concern, ingredient, minPrice, maxPrice, minRating, page, size, sortBy, direction);
    }

    @GetMapping("/featured")
    public List<ProductResponse> featured() { return service.featured(); }

    @GetMapping("/{slug}/related")
    public List<ProductResponse> related(@PathVariable String slug) { return service.related(slug); }

    @GetMapping("/{slug}")
    public ProductDetailResponse bySlug(@PathVariable String slug) { return service.bySlug(slug); }
}
