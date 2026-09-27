package com.glowguide.controller;

import com.glowguide.dto.review.ReviewRequest;
import com.glowguide.dto.review.ReviewResponse;
import com.glowguide.security.UserPrincipal;
import com.glowguide.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService service;

    @GetMapping("/product/{productId}")
    public Page<ReviewResponse> forProduct(@PathVariable String productId,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "20") int size) {
        return service.forProduct(productId, page, size);
    }

    @PostMapping("/product/{productId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse create(@PathVariable String productId, @Valid @RequestBody ReviewRequest request,
                                 @AuthenticationPrincipal UserPrincipal principal) {
        return service.create(productId, request, principal.getId());
    }

    @GetMapping("/mine")
    public List<ReviewResponse> mine(@AuthenticationPrincipal UserPrincipal principal) {
        return service.mine(principal.getId());
    }
}
