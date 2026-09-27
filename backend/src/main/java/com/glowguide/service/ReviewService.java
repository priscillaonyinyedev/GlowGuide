package com.glowguide.service;

import com.glowguide.dto.review.ReviewRequest;
import com.glowguide.dto.review.ReviewResponse;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.model.Product;
import com.glowguide.model.Review;
import com.glowguide.model.ReviewStatus;
import com.glowguide.model.User;
import com.glowguide.repository.ProductRepository;
import com.glowguide.repository.ReviewRepository;
import com.glowguide.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviews;
    private final ProductRepository products;
    private final UserRepository users;

    public Page<ReviewResponse> forProduct(String productId, int page, int size) {
        Product product = activeProduct(productId);
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(1, Math.min(size, 50)), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Review> result = reviews.findByProductIdAndStatus(productId, ReviewStatus.APPROVED, pageable);
        return result.map(review -> ReviewResponse.from(review, product.getSlug(), product.getName()));
    }

    public ReviewResponse create(String productId, ReviewRequest request, String userId) {
        Product product = activeProduct(productId);
        User user = users.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Review review = reviews.findByProductIdAndUserId(productId, userId)
                .orElseGet(() -> Review.builder().productId(productId).userId(userId).build());
        review.setUserName(user.getName());
        review.setUserProfileImageUrl(user.getProfileImageUrl());
        review.setRating(request.rating());
        review.setText(request.text().trim());
        review.setStatus(ReviewStatus.PENDING);
        Review saved = reviews.save(review);
        refreshAverage(product);
        return ReviewResponse.from(saved, product.getSlug(), product.getName());
    }

    public List<ReviewResponse> mine(String userId) {
        return reviews.findByUserIdOrderByCreatedAtDesc(userId).stream().map(review -> {
            Product product = products.findById(review.getProductId()).orElse(null);
            return ReviewResponse.from(review, product == null ? null : product.getSlug(), product == null ? "Removed product" : product.getName());
        }).toList();
    }

    public Page<ReviewResponse> adminList(ReviewStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(1, Math.min(size, 100)), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Review> result = status == null ? reviews.findAllByOrderByCreatedAtDesc(pageable) : reviews.findByStatus(status, pageable);
        return result.map(review -> {
            Product product = products.findById(review.getProductId()).orElse(null);
            return ReviewResponse.from(review, product == null ? null : product.getSlug(), product == null ? "Removed product" : product.getName());
        });
    }

    public ReviewResponse moderate(String id, ReviewStatus status) {
        Review review = reviews.findById(id).orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setStatus(status);
        Review saved = reviews.save(review);
        products.findById(review.getProductId()).ifPresent(this::refreshAverage);
        Product product = products.findById(review.getProductId()).orElse(null);
        return ReviewResponse.from(saved, product == null ? null : product.getSlug(), product == null ? "Removed product" : product.getName());
    }

    public void delete(String id) {
        Review review = reviews.findById(id).orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        reviews.delete(review);
        products.findById(review.getProductId()).ifPresent(this::refreshAverage);
    }

    private Product activeProduct(String id) {
        return products.findById(id).filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private void refreshAverage(Product product) {
        List<Review> approved = reviews.findByProductIdAndStatus(product.getId(), ReviewStatus.APPROVED);
        product.setReviewCount(approved.size());
        product.setAverageRating(approved.isEmpty() ? 0 : Math.round(approved.stream().mapToInt(Review::getRating).average().orElse(0) * 10.0) / 10.0);
        products.save(product);
    }
}
