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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "newsletter_subscribers")
public class NewsletterSubscriber {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    @CreatedDate
    private Instant subscribedAt;
}
