package com.glowguide.service;

import com.glowguide.dto.ingredient.IngredientResponse;
import com.glowguide.dto.ingredient.IngredientUpsertRequest;
import com.glowguide.exception.BadRequestException;
import com.glowguide.exception.DuplicateResourceException;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.model.Ingredient;
import com.glowguide.repository.IngredientRepository;
import com.glowguide.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class IngredientService {
    private final IngredientRepository ingredients;
    private final ProductRepository products;

    public Page<IngredientResponse> adminList(int page, int size) {
        return ingredients.findAll(PageRequest.of(Math.max(page, 0), Math.max(1, Math.min(size, 100)), Sort.by("name")))
                .map(IngredientResponse::from);
    }

    public IngredientResponse create(IngredientUpsertRequest request) {
        Ingredient ingredient = new Ingredient();
        apply(ingredient, request);
        ingredient.setDemoData(false);
        return IngredientResponse.from(ingredients.save(ingredient));
    }

    public IngredientResponse update(String id, IngredientUpsertRequest request) {
        Ingredient ingredient = ingredients.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ingredient not found"));
        String oldSlug = ingredient.getSlug();
        apply(ingredient, request);
        Ingredient saved = ingredients.save(ingredient);
        if (!oldSlug.equals(saved.getSlug())) products.findAll().stream()
                .filter(p -> p.getIngredientSlugs() != null && p.getIngredientSlugs().contains(oldSlug)).forEach(product -> {
                    product.setIngredientSlugs(replace(product.getIngredientSlugs(), oldSlug, saved.getSlug()));
                    product.setKeyIngredientSlugs(replace(product.getKeyIngredientSlugs(), oldSlug, saved.getSlug()));
                    products.save(product);
                });
        return IngredientResponse.from(saved);
    }

    public void delete(String id) {
        Ingredient ingredient = ingredients.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ingredient not found"));
        boolean inUse = products.findAll().stream().anyMatch(p -> p.getIngredientSlugs() != null && p.getIngredientSlugs().contains(ingredient.getSlug()));
        if (inUse) throw new BadRequestException("This ingredient is used by products. Remove it from those products before deleting it.");
        ingredients.delete(ingredient);
    }

    private void apply(Ingredient ingredient, IngredientUpsertRequest request) {
        String slug = slugify(request.slug() == null || request.slug().isBlank() ? request.name() : request.slug());
        boolean conflict = ingredients.findBySlug(slug).filter(other -> !other.getId().equals(ingredient.getId())).isPresent();
        if (conflict) throw new DuplicateResourceException("An ingredient already uses this URL slug");
        ingredient.setName(request.name().trim());
        ingredient.setSlug(slug);
        ingredient.setWhatItIs(request.whatItIs().trim());
        ingredient.setWhatItDoes(request.whatItDoes().trim());
        ingredient.setCommonUses(clean(request.commonUses()));
        ingredient.setSuitableSkinTypes(request.suitableSkinTypes() == null ? List.of() : request.suitableSkinTypes());
        ingredient.setTargetedConcerns(request.targetedConcerns() == null ? List.of() : request.targetedConcerns());
        ingredient.setUsageInfo(clean(request.usageInfo()));
        ingredient.setIrritationConsiderations(clean(request.irritationConsiderations()));
        ingredient.setCompatibleIngredientSlugs(clean(request.compatibleIngredientSlugs()));
        ingredient.setCautionIngredientSlugs(clean(request.cautionIngredientSlugs()));
        ingredient.setImageUrl(clean(request.imageUrl()));
    }

    private List<String> clean(List<String> values) {
        return values == null ? List.of() : values.stream().filter(v -> v != null && !v.isBlank()).map(String::trim).distinct().toList();
    }
    private String clean(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private List<String> replace(List<String> values, String from, String to) {
        return values == null ? List.of() : values.stream().map(v -> v.equals(from) ? to : v).distinct().toList();
    }
    private String slugify(String value) {
        String slug = Normalizer.normalize(value.trim().toLowerCase(Locale.ROOT), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        if (slug.isBlank()) throw new BadRequestException("Ingredient name must contain letters or numbers");
        return slug;
    }
}
