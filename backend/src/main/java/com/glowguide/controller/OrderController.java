package com.glowguide.controller;

import com.glowguide.dto.order.OrderCheckoutRequest;
import com.glowguide.dto.order.OrderResponse;
import com.glowguide.security.UserPrincipal;
import com.glowguide.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse checkout(@Valid @RequestBody OrderCheckoutRequest request,
                                  @AuthenticationPrincipal UserPrincipal principal) {
        return service.checkout(principal.getId(), request);
    }

    @GetMapping
    public List<OrderResponse> mine(@AuthenticationPrincipal UserPrincipal principal) {
        return service.mine(principal.getId());
    }

    @GetMapping("/{id}")
    public OrderResponse get(@PathVariable String id, @AuthenticationPrincipal UserPrincipal principal) {
        return service.get(id, principal.getId());
    }
}
