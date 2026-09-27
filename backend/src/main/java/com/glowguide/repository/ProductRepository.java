package com.glowguide.repository;

import com.glowguide.model.Product;
import com.glowguide.model.ProductCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String>, ProductRepositoryCustom {

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    Page<Product> findByFeaturedTrueAndActiveTrue(Pageable pageable);

    List<Product> findByActiveTrue();

    List<Product> findByCategoryAndActiveTrue(ProductCategory category);

    List<Product> findByIdIn(List<String> ids);

    List<Product> findByBrandIdAndActiveTrue(String brandId);

    List<Product> findByIngredientSlugsContainingAndActiveTrue(String ingredientSlug);

    List<Product> findTop8ByCategoryAndActiveTrueAndIdNot(ProductCategory category, String excludedId);
}
