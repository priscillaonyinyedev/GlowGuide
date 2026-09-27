package com.glowguide.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/** Educational Learn-section article. Rendered at /learn/{slug} with dynamic SEO metadata. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "articles")
public class Article {

    @Id
    private String id;

    private String title;

    @Indexed(unique = true)
    private String slug;

    private ArticleCategory category;
    private String excerpt;
    private String content;
    private String coverImageUrl;
    private String author;

    private String seoTitle;
    private String seoDescription;

    @CreatedDate
    private Instant publishedAt;

    @Builder.Default
    private boolean demoData = false;
}
