package com.glowguide.dto.routine;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record RoutineStepRequest(@Min(0) int order, @NotBlank String productId) {}
