package com.glowguide.dto.catalog;

public record AdminAnalyticsResponse(long users, long products, long sampleProducts, long ingredients,
                                     long orders, long unpaidOrders, long reviews, long pendingReviews) {}
