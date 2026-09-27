package com.glowguide.dto.catalog;

import com.glowguide.model.Article;
import com.glowguide.model.ArticleCategory;

import java.time.Instant;

public record ArticleResponse(
        String id, String title, String slug, ArticleCategory category,
        String excerpt, String content, String coverImageUrl, String author,
        String seoTitle, String seoDescription, Instant publishedAt, boolean demoData
) {
    public static ArticleResponse from(Article article) {
        return new ArticleResponse(article.getId(), article.getTitle(), article.getSlug(), article.getCategory(),
                article.getExcerpt(), article.getContent(), article.getCoverImageUrl(), article.getAuthor(),
                article.getSeoTitle(), article.getSeoDescription(), article.getPublishedAt(), article.isDemoData());
    }
}
