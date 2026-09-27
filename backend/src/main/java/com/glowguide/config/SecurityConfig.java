package com.glowguide.config;

import com.glowguide.security.CustomOAuth2UserService;
import com.glowguide.security.JwtAuthenticationFilter;
import com.glowguide.security.OAuth2AuthenticationSuccessHandler;
import com.glowguide.security.RestAuthEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Central Spring Security wiring: stateless JWT auth for the REST API, plus
 * the Google OAuth2 login flow (which needs a short-lived session purely for
 * the authorization-code handshake, before a JWT takes over for API calls).
 *
 * Every /api/admin/** route additionally requires ROLE_ADMIN - this is
 * enforced here on the server, not just hidden in the React admin UI.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final RestAuthEntryPoint restAuthEntryPoint;
    private final CorsConfigurationSource corsConfigurationSource;
    @Value("${app.oauth2.enabled:false}")
    private boolean oauthEnabled;
    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(handling -> handling.authenticationEntryPoint(restAuthEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        // Public read-only content
                        .requestMatchers(HttpMethod.GET,
                                "/api/products/**", "/api/brands/**", "/api/categories/**",
                                "/api/ingredients/**", "/api/articles/**", "/api/reviews/product/**",
                                "/robots.txt", "/sitemap.xml"
                        ).permitAll()
                        // Auth + OAuth2 endpoints
                        .requestMatchers("/api/auth/**", "/oauth2/**", "/login/oauth2/**").permitAll()
                        .requestMatchers("/api/contact", "/api/newsletter/**", "/api/assistant/**").permitAll()
                        // Admin-only
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // Everything else requires authentication
                        .anyRequest().authenticated());

        if (oauthEnabled) {
            http.oauth2Login(oauth2 -> oauth2
                    .userInfoEndpoint(userInfo -> userInfo.oidcUserService(customOAuth2UserService))
                    .successHandler(oAuth2AuthenticationSuccessHandler)
                    .failureHandler((request, response, exception) ->
                            response.sendRedirect(frontendBaseUrl + "/login?oauthError=1")));
        }
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
