package com.glowguide.repository;

import com.glowguide.model.Ingredient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface IngredientRepository extends MongoRepository<Ingredient, String> {
    Optional<Ingredient> findBySlug(String slug);
    boolean existsBySlug(String slug);
    Page<Ingredient> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<Ingredient> findBySlugIn(List<String> slugs);
}
