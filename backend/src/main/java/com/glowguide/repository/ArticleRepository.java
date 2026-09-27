package com.glowguide.repository;

import com.glowguide.model.Article;
import com.glowguide.model.ArticleCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ArticleRepository extends MongoRepository<Article, String> {
    Optional<Article> findBySlug(String slug);
    Page<Article> findByCategory(ArticleCategory category, Pageable pageable);
}
