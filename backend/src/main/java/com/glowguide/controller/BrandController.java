package com.glowguide.controller;

import com.glowguide.dto.catalog.BrandResponse;
import com.glowguide.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {
    private final CatalogService catalog;

    @GetMapping
    public List<BrandResponse> list() { return catalog.brands(); }

    @GetMapping("/{slug}")
    public BrandResponse get(@PathVariable String slug) { return catalog.brand(slug); }
}
