package com.glowguide.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record OrderCheckoutRequest(@NotNull @Valid AddressRequest shippingAddress,
                                   @Valid PaymentRequest payment) {}
