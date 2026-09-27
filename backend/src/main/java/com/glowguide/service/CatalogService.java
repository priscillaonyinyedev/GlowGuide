package com.glowguide.service;

import com.glowguide.dto.catalog.ArticleResponse;
import com.glowguide.dto.catalog.BrandResponse;
import com.glowguide.dto.catalog.CategoryResponse;
import com.glowguide.dto.ingredient.IngredientDetailResponse;
import com.glowguide.dto.ingredient.IngredientResponse;
import com.glowguide.dto.product.ProductResponse;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.model.*;
import com.glowguide.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CatalogService {
    private final BrandRepository brands;
    private final CategoryRepository categories;
    private final IngredientRepository ingredients;
    private final ProductRepository products;
    private final ArticleRepository articles;
    private final MongoTemplate mongoTemplate;

    public List<BrandResponse> brands() {
        return brands.findAll(Sort.by(Sort.Direction.ASC, "name")).stream().map(BrandResponse::from).toList();
    }

    public BrandResponse brand(String slug) {
        return brands.findBySlug(slug).map(BrandResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
    }

    public List<CategoryResponse> categories() {
        return categories.findAll(Sort.by(Sort.Direction.ASC, "name")).stream().map(CategoryResponse::from).toList();
    }

    public CategoryResponse category(String slug) {
        return categories.findBySlug(slug).map(CategoryResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    public Page<IngredientResponse> ingredients(String q, SkinConcern concern, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(1, Math.min(size, 100)), Sort.by("name"));
        Query query = new Query().with(pageable);
        List<Criteria> filters = new ArrayList<>();
        if (q != null && !q.isBlank()) {
            Pattern pattern = Pattern.compile(Pattern.quote(q.trim()), Pattern.CASE_INSENSITIVE);
            filters.add(new Criteria().orOperator(Criteria.where("name").regex(pattern), Criteria.where("whatItDoes").regex(pattern)));
        }
        if (concern != null) filters.add(Criteria.where("targetedConcerns").is(concern));
        if (!filters.isEmpty()) query.addCriteria(new Criteria().andOperator(filters.toArray(Criteria[]::new)));
        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Ingredient.class);
        List<IngredientResponse> content = mongoTemplate.find(query, Ingredient.class).stream().map(IngredientResponse::from).toList();
        return new PageImpl<>(content, pageable, total);
    }

    public IngredientDetailResponse ingredient(String slug) {
        Ingredient ingredient = ingredients.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found"));
        List<String> compatibleSlugs = ingredient.getCompatibleIngredientSlugs() == null ? List.of() : ingredient.getCompatibleIngredientSlugs();
        List<String> cautionSlugs = ingredient.getCautionIngredientSlugs() == null ? List.of() : ingredient.getCautionIngredientSlugs();
        List<ProductResponse> matchingProducts = products.findByIngredientSlugsContainingAndActiveTrue(slug)
                .stream().map(ProductResponse::from).toList();
        return new IngredientDetailResponse(IngredientResponse.from(ingredient), ingredients.findBySlugIn(compatibleSlugs).stream().map(IngredientResponse::from).toList(),
                ingredients.findBySlugIn(cautionSlugs).stream().map(IngredientResponse::from).toList(), matchingProducts);
    }

    public Page<ArticleResponse> articles(ArticleCategory category, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(1, Math.min(size, 48)), Sort.by(Sort.Direction.DESC, "publishedAt"));
        Page<Article> result = category == null ? articles.findAll(pageable) : articles.findByCategory(category, pageable);
        return result.map(ArticleResponse::from);
    }

    public ArticleResponse article(String slug) {
        return articles.findBySlug(slug).map(ArticleResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));
    }
}
