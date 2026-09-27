package com.glowguide.dto.shopping;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record QuantityRequest(@Min(1) @Max(20) int quantity) {}
