package com.glowguide.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(@NotBlank @Size(max = 100) String name,
                                   @Size(max = 500) String profileImageUrl) {}
