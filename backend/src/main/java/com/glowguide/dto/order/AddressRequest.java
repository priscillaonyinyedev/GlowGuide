package com.glowguide.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddressRequest(
        @NotBlank @Size(max = 100) String fullName,
        @NotBlank @Size(max = 150) String line1,
        @Size(max = 150) String line2,
        @NotBlank @Size(max = 80) String city,
        @NotBlank @Size(max = 80) String state,
        @NotBlank @Size(max = 20) String postalCode,
        @NotBlank @Size(max = 80) String country,
        @NotBlank @Size(max = 30) String phone
) {}
