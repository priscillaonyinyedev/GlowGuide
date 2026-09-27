package com.glowguide.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.List;

/**
 * Once Spring Security has completed the Google OAuth2 handshake and
 * CustomOAuth2UserService has resolved/created the matching GlowGuide User,
 * this issues our own JWT and redirects the browser back to the SPA so it can
 * pick the token up and store it exactly like a normal email/password login.
 */
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;

    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {

        String userId;
        String email;

        if (authentication.getPrincipal() instanceof GlowGuideOidcUser oidcUser) {
            userId = oidcUser.getUserId();
            email = oidcUser.getEmail();
        } else {
            throw new IllegalStateException("Unexpected OAuth2 principal type: " + authentication.getPrincipal().getClass());
        }

        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        String accessToken = jwtService.generateAccessToken(userId, email, roles);

        String targetUrl = UriComponentsBuilder.fromUriString(frontendBaseUrl + "/oauth2/redirect")
                .fragment("token=" + accessToken)
                .build().toUriString();

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
