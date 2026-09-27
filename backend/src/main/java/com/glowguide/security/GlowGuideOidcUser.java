package com.glowguide.security;

import com.glowguide.model.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;

import java.util.List;

/** OIDC-flavoured counterpart to OAuth2UserPrincipal - carries the resolved GlowGuide user id through the Google login flow. */
@Getter
public class GlowGuideOidcUser extends DefaultOidcUser {

    private final String userId;

    public GlowGuideOidcUser(User user, OidcIdToken idToken, OidcUserInfo userInfo) {
        super(authorities(user), idToken, userInfo);
        this.userId = user.getId();
    }

    private static List<GrantedAuthority> authorities(User user) {
        return user.getRoles().stream()
                .map(role -> (GrantedAuthority) new SimpleGrantedAuthority(role.name()))
                .toList();
    }
}
