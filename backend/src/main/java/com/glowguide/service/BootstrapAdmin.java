package com.glowguide.service;

import com.glowguide.model.AuthProvider;
import com.glowguide.model.Role;
import com.glowguide.model.User;
import com.glowguide.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.Set;

/** Creates the first administrator only when an operator explicitly provides bootstrap credentials. */
@Component
@RequiredArgsConstructor
public class BootstrapAdmin implements ApplicationRunner {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap-admin.email:}")
    private String email;

    @Value("${app.bootstrap-admin.password:}")
    private String password;

    @Override
    public void run(ApplicationArguments args) {
        boolean hasEmail = email != null && !email.isBlank();
        boolean hasPassword = password != null && !password.isBlank();
        if (!hasEmail && !hasPassword) return;
        if (!hasEmail || !hasPassword) {
            throw new IllegalStateException("Set both BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD to create the initial administrator.");
        }
        if (password.length() < 12) {
            throw new IllegalStateException("BOOTSTRAP_ADMIN_PASSWORD must contain at least 12 characters.");
        }
        if (users.existsByRolesContaining(Role.ROLE_ADMIN)) return;

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        if (users.existsByEmail(normalizedEmail)) {
            throw new IllegalStateException("The bootstrap administrator email already belongs to a non-admin account. Choose the account explicitly in the admin user manager after bootstrapping another admin.");
        }
        users.save(User.builder()
                .name("GlowGuide Administrator")
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(password))
                .roles(Set.of(Role.ROLE_ADMIN, Role.ROLE_USER))
                .provider(AuthProvider.LOCAL)
                .emailVerified(true)
                .enabled(true)
                .build());
    }
}
