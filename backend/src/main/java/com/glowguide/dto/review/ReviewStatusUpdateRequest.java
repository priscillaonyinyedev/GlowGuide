package com.glowguide.dto.review;

import com.glowguide.model.ReviewStatus;
import jakarta.validation.constraints.NotNull;

public record ReviewStatusUpdateRequest(@NotNull ReviewStatus status) {}
