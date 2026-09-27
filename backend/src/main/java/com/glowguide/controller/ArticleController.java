package com.glowguide.controller;

import com.glowguide.dto.catalog.ArticleResponse;
import com.glowguide.model.ArticleCategory;
import com.glowguide.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {
    private final CatalogService catalog;

    @GetMapping
    public Page<ArticleResponse> list(@RequestParam(required = false) ArticleCategory category,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "24") int size) {
        return catalog.articles(category, page, size);
    }

    @GetMapping("/{slug}")
    public ArticleResponse get(@PathVariable String slug) { return catalog.article(slug); }
}
