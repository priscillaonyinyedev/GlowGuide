package com.glowguide.controller;

import com.glowguide.dto.ingredient.IngredientResponse;
import com.glowguide.dto.ingredient.IngredientUpsertRequest;
import com.glowguide.dto.order.AdminOrderResponse;
import com.glowguide.dto.order.OrderStatusUpdateRequest;
import com.glowguide.dto.review.ReviewResponse;
import com.glowguide.dto.review.ReviewStatusUpdateRequest;
import com.glowguide.dto.user.EnabledUpdateRequest;
import com.glowguide.dto.user.RolesUpdateRequest;
import com.glowguide.dto.user.UserSummaryDto;
import com.glowguide.exception.BadRequestException;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.model.ReviewStatus;
import com.glowguide.model.Role;
import com.glowguide.model.User;
import com.glowguide.security.UserPrincipal;
import com.glowguide.service.AuthService;
import com.glowguide.service.IngredientService;
import com.glowguide.service.OrderService;
import com.glowguide.service.ReviewService;
import com.glowguide.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminManagementController {
    private final IngredientService ingredients;
    private final UserRepository users;
    private final OrderService orders;
    private final ReviewService reviews;

    @GetMapping("/ingredients")
    public Page<IngredientResponse> ingredients(@RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "50") int size) {
        return ingredients.adminList(page, size);
    }

    @PostMapping("/ingredients")
    public IngredientResponse createIngredient(@Valid @RequestBody IngredientUpsertRequest request) { return ingredients.create(request); }

    @PutMapping("/ingredients/{id}")
    public IngredientResponse updateIngredient(@PathVariable String id, @Valid @RequestBody IngredientUpsertRequest request) {
        return ingredients.update(id, request);
    }

    @DeleteMapping("/ingredients/{id}")
    public void deleteIngredient(@PathVariable String id) { ingredients.delete(id); }

    @GetMapping("/users")
    public Page<UserSummaryDto> users(@RequestParam(required = false) String q,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "50") int size) {
        PageRequest pageable = PageRequest.of(Math.max(page, 0), Math.max(1, Math.min(size, 100)), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> result = q == null || q.isBlank() ? users.findAll(pageable)
                : users.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q.trim(), q.trim(), pageable);
        return result.map(AuthService::toSummary);
    }

    @PutMapping("/users/{id}/roles")
    public UserSummaryDto updateRoles(@PathVariable String id, @Valid @RequestBody RolesUpdateRequest request,
                                      @AuthenticationPrincipal UserPrincipal principal) {
        User user = users.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (id.equals(principal.getId()) && !request.roles().contains(Role.ROLE_ADMIN)) {
            throw new BadRequestException("You cannot remove your own administrator access");
        }
        user.setRoles(request.roles());
        return AuthService.toSummary(users.save(user));
    }

    @PutMapping("/users/{id}/status")
    public UserSummaryDto setEnabled(@PathVariable String id, @Valid @RequestBody EnabledUpdateRequest request,
                                     @AuthenticationPrincipal UserPrincipal principal) {
        if (id.equals(principal.getId()) && !request.enabled()) throw new BadRequestException("You cannot disable your own account");
        User user = users.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(request.enabled());
        return AuthService.toSummary(users.save(user));
    }

    @GetMapping("/orders")
    public Page<AdminOrderResponse> orders(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "50") int size) { return orders.adminList(page, size); }

    @PutMapping("/orders/{id}/status")
    public AdminOrderResponse updateOrder(@PathVariable String id, @Valid @RequestBody OrderStatusUpdateRequest request) {
        return orders.updateStatus(id, request.status());
    }

    @GetMapping("/reviews")
    public Page<ReviewResponse> reviews(@RequestParam(required = false) ReviewStatus status,
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "50") int size) { return reviews.adminList(status, page, size); }

    @PutMapping("/reviews/{id}/status")
    public ReviewResponse moderateReview(@PathVariable String id, @Valid @RequestBody ReviewStatusUpdateRequest request) {
        return reviews.moderate(id, request.status());
    }

    @DeleteMapping("/reviews/{id}")
    public void deleteReview(@PathVariable String id) { reviews.delete(id); }
}
