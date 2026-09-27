package com.glowguide.dto.order;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PaymentRequest(
        @Size(max = 40) String provider,
        @Size(max = 200) String providerPaymentId,
        @Size(max = 30) String cardBrand,
        @Pattern(regexp = "^$|^[0-9]{4}$") String last4
) {}
