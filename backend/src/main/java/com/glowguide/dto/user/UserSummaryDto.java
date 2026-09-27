package com.glowguide.dto.user;

import com.glowguide.model.Role;
import com.glowguide.model.SkinProfile;

import java.util.Set;

public record UserSummaryDto(
        String id,
        String name,
        String email,
        String profileImageUrl,
        Set<Role> roles,
        boolean emailVerified,
        boolean enabled,
        SkinProfile skinProfile
) {
}
