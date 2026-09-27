package com.glowguide.dto.auth;

import com.glowguide.dto.user.UserSummaryDto;

public record AuthResponse(
        String accessToken,
        String tokenType,
        UserSummaryDto user
) {
    public static AuthResponse of(String accessToken, UserSummaryDto user) {
        return new AuthResponse(accessToken, "Bearer", user);
    }
}
