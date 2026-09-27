package com.glowguide.controller;

import com.glowguide.dto.catalog.AdminAnalyticsResponse;
import com.glowguide.dto.quiz.AdminInsightsResponse;
import com.glowguide.model.*;
import com.glowguide.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminInsightsController {
    private final QuizResultRepository quizzes;
    private final UserRepository users;
    private final ProductRepository products;
    private final IngredientRepository ingredients;
    private final OrderRepository orders;
    private final ReviewRepository reviews;

    @GetMapping("/quiz-data")
    public AdminInsightsResponse quizData() {
        var results = quizzes.findAll();
        return new AdminInsightsResponse(results.size(),
                tally(results.stream().map(QuizResult::getSkinType)),
                tally(results.stream().flatMap(q -> q.getConcerns() == null ? Stream.empty() : q.getConcerns().stream())),
                tally(results.stream().map(QuizResult::getSensitivity)),
                tally(results.stream().map(QuizResult::getBudget)));
    }

    @GetMapping("/analytics")
    public AdminAnalyticsResponse analytics() {
        long unpaid = orders.findAll().stream().filter(o -> o.getPayment() == null || o.getPayment().getStatus() == PaymentStatus.PENDING).count();
        long pendingReviews = reviews.findByStatus(ReviewStatus.PENDING, org.springframework.data.domain.PageRequest.of(0, 1)).getTotalElements();
        long sampleProducts = products.findAll().stream().filter(Product::isDemoData).count();
        return new AdminAnalyticsResponse(users.count(), products.count(), sampleProducts, ingredients.count(), orders.count(), unpaid, reviews.count(), pendingReviews);
    }

    private <T> Map<String, Long> tally(Stream<T> values) {
        return values.filter(v -> v != null).map(Object::toString)
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
    }
}
