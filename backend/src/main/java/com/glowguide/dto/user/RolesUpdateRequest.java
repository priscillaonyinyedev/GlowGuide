package com.glowguide.dto.user;

import com.glowguide.model.Role;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public record RolesUpdateRequest(@NotEmpty Set<Role> roles) {}
