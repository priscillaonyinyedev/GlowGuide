package com.glowguide.service;

import com.glowguide.dto.auth.AuthResponse;
import com.glowguide.dto.auth.LoginRequest;
import com.glowguide.dto.auth.SignupRequest;
import com.glowguide.dto.user.UserSummaryDto;
import com.glowguide.exception.BadRequestException;
import com.glowguide.exception.DuplicateResourceException;
import com.glowguide.exception.ExpiredTokenException;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.model.AuthProvider;
import com.glowguide.model.EmailVerificationToken;
import com.glowguide.model.PasswordResetToken;
import com.glowguide.model.Role;
import com.glowguide.model.User;
import com.glowguide.repository.EmailVerificationTokenRepository;
import com.glowguide.repository.PasswordResetTokenRepository;
import com.glowguide.repository.UserRepository;
import com.glowguide.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final int VERIFICATION_TOKEN_HOURS = 24;
    private static final int RESET_TOKEN_MINUTES = 60;

    private final UserRepository userRepository;
    private final EmailVerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthResponse signup(SignupRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        Set<Role> roles = new HashSet<>(Set.of(Role.ROLE_USER));

        User user = User.builder()
                .name(request.name().trim())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.password()))
                .provider(AuthProvider.LOCAL)
                .emailVerified(false)
                .enabled(true)
                .roles(roles)
                .build();

        user = userRepository.save(user);
        issueVerificationEmail(user);

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), roleNames(user));
        return AuthResponse.of(accessToken, toSummary(user));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase().trim(), request.password())
        );

        User user = userRepository.findByEmail(request.email().toLowerCase().trim())
                .orElseThrow(() -> ResourceNotFoundException.of("User", request.email()));

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), roleNames(user));
        return AuthResponse.of(accessToken, toSummary(user));
    }

    public void verifyEmail(String token) {
        EmailVerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        if (verificationToken.isUsed() || verificationToken.getExpiresAt().isBefore(Instant.now())) {
            throw new ExpiredTokenException("This verification link has expired. Please request a new one.");
        }

        User user = userRepository.findById(verificationToken.getUserId())
                .orElseThrow(() -> ResourceNotFoundException.of("User", verificationToken.getUserId()));

        user.setEmailVerified(true);
        userRepository.save(user);

        verificationToken.setUsed(true);
        verificationTokenRepository.save(verificationToken);
    }

    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> ResourceNotFoundException.of("User", email));

        if (user.isEmailVerified()) {
            throw new BadRequestException("This email address is already verified");
        }

        issueVerificationEmail(user);
    }

    public void forgotPassword(String email) {
        userRepository.findByEmail(email.toLowerCase().trim()).ifPresent(user -> {
            if (!emailService.isResetEmailConfigured()) {
                return;
            }
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(UUID.randomUUID().toString())
                    .userId(user.getId())
                    .expiresAt(Instant.now().plus(RESET_TOKEN_MINUTES, ChronoUnit.MINUTES))
                    .used(false)
                    .build();
            resetTokenRepository.save(resetToken);
            emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), resetToken.getToken());
        });
        // Deliberately no exception when the email isn't found - avoids leaking which emails have accounts.
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid password reset token"));

        if (resetToken.isUsed() || resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw new ExpiredTokenException("This password reset link has expired. Please request a new one.");
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> ResourceNotFoundException.of("User", resetToken.getUserId()));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);
    }

    private void issueVerificationEmail(User user) {
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .token(UUID.randomUUID().toString())
                .userId(user.getId())
                .expiresAt(Instant.now().plus(VERIFICATION_TOKEN_HOURS, ChronoUnit.HOURS))
                .used(false)
                .build();
        verificationTokenRepository.save(verificationToken);
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), verificationToken.getToken());
    }

    private Set<String> roleNames(User user) {
        Set<String> names = new HashSet<>();
        user.getRoles().forEach(role -> names.add(role.name()));
        return names;
    }

    public static UserSummaryDto toSummary(User user) {
        return new UserSummaryDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getProfileImageUrl(),
                user.getRoles(),
                user.isEmailVerified(),
                user.isEnabled(),
                user.getSkinProfile()
        );
    }
}
