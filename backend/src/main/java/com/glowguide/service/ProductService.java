package com.glowguide.service;

import com.glowguide.dto.ingredient.IngredientResponse;
import com.glowguide.dto.product.ProductDetailResponse;
import com.glowguide.dto.product.ProductResponse;
import com.glowguide.dto.product.ProductUpsertRequest;
import com.glowguide.exception.BadRequestException;
import com.glowguide.exception.DuplicateResourceException;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.model.*;
import com.glowguide.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository products;
    private final IngredientRepository ingredients;
    private final BrandRepository brands;

    public Page<ProductResponse> search(String q, String brand, ProductCategory category, SkinType skinType,
                                        SkinConcern concern, String ingredient, Double minPrice,
                                        Double maxPrice, Double minRating, int page, int size,
                                        String sortBy, String direction) {
        if ((minPrice != null && minPrice < 0) || (maxPrice != null && maxPrice < 0)
                || (minPrice != null && maxPrice != null && minPrice > maxPrice)) {
            throw new BadRequestException("Enter a valid non-negative price range");
        }
        if (minRating != null && (minRating < 0 || minRating > 5)) throw new BadRequestException("Minimum rating must be between 0 and 5");
        Pageable pageable = pageRequest(page, size, sortBy, direction);
        List<String> matchedIngredientSlugs = q == null || q.isBlank() ? List.of() : ingredients.findByNameContainingIgnoreCase(q.trim(), PageRequest.of(0, 50))
                .getContent().stream().map(Ingredient::getSlug).toList();
        ProductFilter filter = ProductFilter.builder()
                .keyword(q)
                .keywordIngredientSlugs(matchedIngredientSlugs)
                .brandSlugs(brand == null || brand.isBlank() ? List.of() : List.of(brand))
                .categories(category == null ? List.of() : List.of(category))
                .skinTypes(skinType == null ? List.of() : List.of(skinType))
                .concerns(concern == null ? List.of() : List.of(concern))
                .ingredientSlugs(ingredient == null || ingredient.isBlank() ? List.of() : List.of(ingredient))
                .minPrice(minPrice).maxPrice(maxPrice).minRating(minRating).build();
        return products.search(filter, pageable).map(ProductResponse::from);
    }

    public List<ProductResponse> featured() {
        return products.findByFeaturedTrueAndActiveTrue(PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "createdAt")))
                .map(ProductResponse::from).getContent();
    }

    public ProductDetailResponse bySlug(String slug) {
        Product product = products.findBySlug(slug)
                .filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        List<IngredientResponse> relatedIngredients = ingredients.findBySlugIn(product.getIngredientSlugs()).stream()
                .map(IngredientResponse::from).toList();
        List<ProductResponse> relatedProducts = products.findTop8ByCategoryAndActiveTrueAndIdNot(product.getCategory(), product.getId())
                .stream().map(ProductResponse::from).toList();
        return new ProductDetailResponse(ProductResponse.from(product), relatedIngredients, relatedProducts);
    }

    public List<ProductResponse> related(String slug) {
        Product product = products.findBySlug(slug)
                .filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return products.findTop8ByCategoryAndActiveTrueAndIdNot(product.getCategory(), product.getId())
                .stream().map(ProductResponse::from).toList();
    }

    public ProductResponse create(ProductUpsertRequest request) {
        Product product = new Product();
        apply(product, request);
        return ProductResponse.from(products.save(product));
    }

    public org.springframework.data.domain.Page<ProductResponse> adminList(int page, int size) {
        return products.findAll(PageRequest.of(Math.max(page, 0), Math.max(1, Math.min(size, 100)),
                Sort.by(Sort.Direction.DESC, "createdAt"))).map(ProductResponse::from);
    }

    public ProductResponse update(String id, ProductUpsertRequest request) {
        Product product = products.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        apply(product, request);
        return ProductResponse.from(products.save(product));
    }

    public void deactivate(String id) {
        Product product = products.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setActive(false);
        products.save(product);
    }

    private void apply(Product product, ProductUpsertRequest request) {
        Brand brand = brands.findById(request.brandId()).orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
        String slug = request.slug() == null || request.slug().isBlank() ? slugify(request.name()) : slugify(request.slug());
        boolean slugTaken = products.findBySlug(slug).filter(existing -> !existing.getId().equals(product.getId())).isPresent();
        if (slugTaken) throw new DuplicateResourceException("A product already uses this URL slug");
        List<String> ingredientSlugs = request.ingredientSlugs() == null ? List.of() : request.ingredientSlugs();
        List<String> keyIngredients = request.keyIngredientSlugs() == null ? List.of() : request.keyIngredientSlugs();
        Set<String> knownIngredientSlugs = ingredients.findBySlugIn(ingredientSlugs).stream().map(Ingredient::getSlug).collect(java.util.stream.Collectors.toSet());
        if (!knownIngredientSlugs.containsAll(ingredientSlugs) || !knownIngredientSlugs.containsAll(keyIngredients)) {
            throw new BadRequestException("Every product ingredient must exist in the ingredient library");
        }
        product.setName(request.name().trim());
        product.setSlug(slug);
        product.setBrandId(brand.getId());
        product.setBrandName(brand.getName());
        product.setBrandSlug(brand.getSlug());
        product.setCategory(request.category());
        product.setPrice(request.price());
        product.setCurrency(request.currency().trim().toUpperCase(java.util.Locale.ROOT));
        product.setDescription(request.description().trim());
        product.setOfficialUrl(request.officialUrl() == null || request.officialUrl().isBlank() ? null : request.officialUrl().trim());
        product.setImages(request.images() == null ? List.of() : request.images());
        product.setBenefits(request.benefits() == null ? List.of() : request.benefits());
        product.setDirections(request.directions() == null ? List.of() : request.directions());
        product.setIngredientSlugs(ingredientSlugs);
        product.setKeyIngredientSlugs(keyIngredients);
        product.setSuitableSkinTypes(request.suitableSkinTypes() == null ? List.of() : request.suitableSkinTypes());
        product.setTargetedConcerns(request.targetedConcerns() == null ? List.of() : request.targetedConcerns());
        product.setTags(request.tags() == null ? List.of() : request.tags());
        product.setRecommendedRoutineStep(request.recommendedRoutineStep());
        product.setStockQuantity(request.stockQuantity());
        product.setFeatured(request.featured());
        product.setActive(request.active());
        product.setDemoData(false);
    }

    private String slugify(String value) {
        String slug = java.text.Normalizer.normalize(value.trim().toLowerCase(java.util.Locale.ROOT), java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        if (slug.isBlank()) throw new BadRequestException("Product name must contain letters or numbers");
        return slug;
    }

    private Pageable pageRequest(int page, int size, String sortBy, String direction) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(1, Math.min(size, 48));
        String field = switch (sortBy == null ? "" : sortBy) {
            case "price" -> "price";
            case "averageRating" -> "averageRating";
            case "createdAt" -> "createdAt";
            default -> "featured";
        };
        Sort.Direction order = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        // The requested field can contain many ties (especially featured=false).
        // Add a stable unique tie-breaker so Mongo does not repeat or skip items
        // when the user moves between shop pages.
        return PageRequest.of(safePage, safeSize, Sort.by(order, field).and(Sort.by(Sort.Direction.ASC, "slug")));
    }
}
