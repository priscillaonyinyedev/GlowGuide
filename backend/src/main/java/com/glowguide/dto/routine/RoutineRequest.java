package com.glowguide.dto.routine;

import com.glowguide.model.RoutineType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record RoutineRequest(
        @NotBlank @Size(max = 80) String name,
        @NotNull RoutineType type,
        @NotEmpty @Size(max = 20) List<@Valid RoutineStepRequest> steps
) {}
