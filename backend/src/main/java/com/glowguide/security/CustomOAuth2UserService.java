package com.glowguide.security;

import com.glowguide.model.AuthProvider;
import com.glowguide.model.Role;
import com.glowguide.model.User;
import com.glowguide.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

/**
 * Handles the "Continue with Google" flow server-side: Spring Security fetches
 * the user's Google profile after the OAuth2 redirect, and this service finds
 * or creates the matching GlowGuide account before the SecurityContext is populated.
 */
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends OidcUserService {

    private final UserRepository userRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) {
        OidcUser oidcUser = super.loadUser(userRequest);

        String googleId = oidcUser.getSubject();
        String googleEmail = oidcUser.getEmail();
        if (googleEmail == null || googleEmail.isBlank() || !Boolean.TRUE.equals(oidcUser.getEmailVerified())) {
            throw new OAuth2AuthenticationException(new OAuth2Error("invalid_user_info"),
                    "Google did not return a verified email address");
        }
        String email = googleEmail.trim().toLowerCase(Locale.ROOT);
        String name = oidcUser.getFullName() != null ? oidcUser.getFullName() : email;
        String picture = oidcUser.getPicture();

        User user = userRepository.findByProviderAndProviderId(AuthProvider.GOOGLE, googleId)
                .or(() -> userRepository.findByEmail(email))
                .map(existing -> updateExisting(existing, googleId, picture))
                .orElseGet(() -> createGoogleUser(email, name, googleId, picture));

        OidcIdToken idToken = userRequest.getIdToken();
        OidcUserInfo userInfo = new OidcUserInfo(oidcUser.getClaims());

        return new GlowGuideOidcUser(user, idToken, userInfo);
    }

    private User updateExisting(User user, String googleId, String picture) {
        if (!user.isEnabled()) {
            throw new OAuth2AuthenticationException(new OAuth2Error("access_denied"),
                    "This GlowGuide account is disabled");
        }
        if (user.getProviderId() != null && !user.getProviderId().equals(googleId)) {
            throw new OAuth2AuthenticationException(new OAuth2Error("account_mismatch"),
                    "This email is already linked to a different Google account");
        }
        boolean dirty = false;
        if (user.getProvider() == AuthProvider.LOCAL) {
            user.setProvider(AuthProvider.GOOGLE);
            dirty = true;
        }
        if (user.getProviderId() == null) {
            user.setProviderId(googleId);
            dirty = true;
        }
        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            dirty = true;
        }
        if (user.getProfileImageUrl() == null && picture != null) {
            user.setProfileImageUrl(picture);
            dirty = true;
        }
        return dirty ? userRepository.save(user) : user;
    }

    private User createGoogleUser(String email, String name, String googleId, String picture) {
        Set<Role> roles = new HashSet<>(Set.of(Role.ROLE_USER));
        User newUser = User.builder()
                .name(name)
                .email(email)
                .provider(AuthProvider.GOOGLE)
                .providerId(googleId)
                .profileImageUrl(picture)
                .emailVerified(true)
                .enabled(true)
                .roles(roles)
                .build();
        return userRepository.save(newUser);
    }
}
