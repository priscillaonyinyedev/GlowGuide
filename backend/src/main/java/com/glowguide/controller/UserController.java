package com.glowguide.controller;

import com.glowguide.dto.user.ProfileUpdateRequest;
import com.glowguide.dto.user.SkinProfileUpdateRequest;
import com.glowguide.dto.user.UserSummaryDto;
import com.glowguide.security.UserPrincipal;
import com.glowguide.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;

    @PutMapping
    public UserSummaryDto updateProfile(@Valid @RequestBody ProfileUpdateRequest request,
                                        @AuthenticationPrincipal UserPrincipal principal) {
        return service.updateProfile(principal.getId(), request);
    }

    @PutMapping("/skin-profile")
    public UserSummaryDto updateSkinProfile(@Valid @RequestBody SkinProfileUpdateRequest request,
                                            @AuthenticationPrincipal UserPrincipal principal) {
        return service.updateSkinProfile(principal.getId(), request);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal UserPrincipal principal) { service.deleteAccount(principal.getId()); }
}
