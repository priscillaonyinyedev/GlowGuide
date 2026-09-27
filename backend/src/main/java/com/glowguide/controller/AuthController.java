package com.glowguide.controller;

import com.glowguide.dto.auth.AuthResponse;
import com.glowguide.dto.auth.ForgotPasswordRequest;
import com.glowguide.dto.auth.LoginRequest;
import com.glowguide.dto.auth.ResendVerificationRequest;
import com.glowguide.dto.auth.ResetPasswordRequest;
import com.glowguide.dto.auth.SignupRequest;
import com.glowguide.dto.user.UserSummaryDto;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.repository.UserRepository;
import com.glowguide.security.UserPrincipal;
import com.glowguide.service.AuthService;
import com.glowguide.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @GetMapping("/email-status")
    public ResponseEntity<Map<String, Boolean>> emailStatus() {
        return ResponseEntity.ok(Map.of(
                "resetEmailConfigured", emailService.isResetEmailConfigured(),
                "contactEmailConfigured", emailService.isContactEmailConfigured()));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * JWT is stateless and stored client-side, so logout is primarily a
     * frontend action (clearing the stored token / auth context). This
     * endpoint exists so the client has a single, protected call to hit as
     * part of a consistent logout flow (e.g. to record an audit event later).
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Void> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        authService.resendVerificationEmail(request.email());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.email());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.token(), request.newPassword());
        return ResponseEntity.noContent().build();
    }

    /** Lets the SPA restore auth state after a page refresh using only the stored JWT. */
    @GetMapping("/me")
    public ResponseEntity<UserSummaryDto> me(@AuthenticationPrincipal UserPrincipal principal) {
        var user = userRepository.findById(principal.getId())
                .orElseThrow(() -> ResourceNotFoundException.of("User", principal.getId()));
        return ResponseEntity.ok(AuthService.toSummary(user));
    }
}
