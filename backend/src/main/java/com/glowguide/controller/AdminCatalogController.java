package com.glowguide.controller;

import com.glowguide.dto.catalog.*;
import com.glowguide.service.AdminCatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminCatalogController {
    private final AdminCatalogService catalog;

    @GetMapping("/brands") public List<BrandResponse> brands() { return catalog.brands(); }
    @PostMapping("/brands") public BrandResponse createBrand(@Valid @RequestBody BrandUpsertRequest request) { return catalog.createBrand(request); }
    @PutMapping("/brands/{id}") public BrandResponse updateBrand(@PathVariable String id, @Valid @RequestBody BrandUpsertRequest request) { return catalog.updateBrand(id, request); }
    @DeleteMapping("/brands/{id}") public void deleteBrand(@PathVariable String id) { catalog.deleteBrand(id); }

    @GetMapping("/categories") public List<CategoryResponse> categories() { return catalog.categories(); }
    @PostMapping("/categories") public CategoryResponse createCategory(@Valid @RequestBody CategoryUpsertRequest request) { return catalog.createCategory(request); }
    @PutMapping("/categories/{id}") public CategoryResponse updateCategory(@PathVariable String id, @Valid @RequestBody CategoryUpsertRequest request) { return catalog.updateCategory(id, request); }
    @DeleteMapping("/categories/{id}") public void deleteCategory(@PathVariable String id) { catalog.deleteCategory(id); }
}
