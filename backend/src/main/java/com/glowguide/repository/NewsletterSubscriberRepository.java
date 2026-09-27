package com.glowguide.repository;

import com.glowguide.model.NewsletterSubscriber;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NewsletterSubscriberRepository extends MongoRepository<NewsletterSubscriber, String> {
    boolean existsByEmail(String email);
}
