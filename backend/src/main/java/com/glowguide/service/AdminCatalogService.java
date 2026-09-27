package com.glowguide.service;

import com.glowguide.dto.catalog.*;
import com.glowguide.exception.BadRequestException;
import com.glowguide.exception.DuplicateResourceException;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.model.Brand;
import com.glowguide.model.Category;
import com.glowguide.repository.BrandRepository;
import com.glowguide.repository.CategoryRepository;
import com.glowguide.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AdminCatalogService {
    private final BrandRepository brands;
    private final CategoryRepository categories;
    private final ProductRepository products;

    public List<BrandResponse> brands() { return brands.findAll(Sort.by("name")).stream().map(BrandResponse::from).toList(); }
    public List<CategoryResponse> categories() { return categories.findAll(Sort.by("name")).stream().map(CategoryResponse::from).toList(); }

    public BrandResponse createBrand(BrandUpsertRequest request) {
        Brand brand = new Brand();
        apply(brand, request);
        brand.setDemoData(false);
        return BrandResponse.from(brands.save(brand));
    }

    public BrandResponse updateBrand(String id, BrandUpsertRequest request) {
        Brand brand = brands.findById(id).orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
        String previousSlug = brand.getSlug();
        String previousName = brand.getName();
        apply(brand, request);
        Brand saved = brands.save(brand);
        if (!previousSlug.equals(saved.getSlug()) || !previousName.equals(saved.getName())) {
            products.findAll().stream().filter(p -> id.equals(p.getBrandId())).forEach(product -> {
                product.setBrandName(saved.getName());
                product.setBrandSlug(saved.getSlug());
                products.save(product);
            });
        }
        return BrandResponse.from(saved);
    }

    public void deleteBrand(String id) {
        Brand brand = brands.findById(id).orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
        if (products.findAll().stream().anyMatch(p -> id.equals(p.getBrandId()))) {
            throw new BadRequestException("This brand is referenced by products and cannot be deleted yet");
        }
        brands.delete(brand);
    }

    public CategoryResponse createCategory(CategoryUpsertRequest request) {
        Category category = new Category();
        apply(category, request);
        category.setDemoData(false);
        return CategoryResponse.from(categories.save(category));
    }

    public CategoryResponse updateCategory(String id, CategoryUpsertRequest request) {
        Category category = categories.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        apply(category, request);
        return CategoryResponse.from(categories.save(category));
    }

    public void deleteCategory(String id) {
        Category category = categories.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (products.findAll().stream().anyMatch(p -> p.getCategory() == category.getKey())) {
            throw new BadRequestException("This category is used by products and cannot be deleted yet");
        }
        categories.delete(category);
    }

    private void apply(Brand value, BrandUpsertRequest request) {
        String slug = slug(request.slug() == null || request.slug().isBlank() ? request.name() : request.slug());
        if (brands.findBySlug(slug).filter(other -> !other.getId().equals(value.getId())).isPresent())
            throw new DuplicateResourceException("A brand already uses this URL slug");
        value.setName(request.name().trim()); value.setSlug(slug); value.setDescription(clean(request.description()));
        value.setLogoUrl(clean(request.logoUrl())); value.setCountryOfOrigin(clean(request.countryOfOrigin()));
    }

    private void apply(Category value, CategoryUpsertRequest request) {
        String slug = slug(request.slug() == null || request.slug().isBlank() ? request.name() : request.slug());
        if (categories.findBySlug(slug).filter(other -> !other.getId().equals(value.getId())).isPresent())
            throw new DuplicateResourceException("A category already uses this URL slug");
        value.setKey(request.key()); value.setName(request.name().trim()); value.setSlug(slug);
        value.setDescription(clean(request.description())); value.setImageUrl(clean(request.imageUrl()));
    }

    private String clean(String v) { return v == null || v.isBlank() ? null : v.trim(); }
    private String slug(String value) {
        String result = Normalizer.normalize(value.trim().toLowerCase(Locale.ROOT), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        if (result.isBlank()) throw new BadRequestException("Name must contain letters or numbers");
        return result;
    }
}
