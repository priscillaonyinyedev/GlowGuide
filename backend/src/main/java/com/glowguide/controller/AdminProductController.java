package com.glowguide.controller;

import com.glowguide.dto.product.ProductResponse;
import com.glowguide.dto.product.ProductUpsertRequest;
import com.glowguide.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {
    private final ProductService products;

    @GetMapping
    public Page<ProductResponse> list(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "50") int size) {
        return products.adminList(page, size);
    }

    @PostMapping
    public ProductResponse create(@Valid @RequestBody ProductUpsertRequest request) {
        return products.create(request);
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable String id, @Valid @RequestBody ProductUpsertRequest request) {
        return products.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deactivate(@PathVariable String id) {
        products.deactivate(id);
    }
}
