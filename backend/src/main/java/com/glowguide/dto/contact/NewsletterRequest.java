package com.glowguide.dto.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NewsletterRequest(@NotBlank @Email @Size(max = 254) String email) {}
