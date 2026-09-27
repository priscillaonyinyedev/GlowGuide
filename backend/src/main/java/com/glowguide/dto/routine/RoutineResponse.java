package com.glowguide.dto.routine;

import com.glowguide.model.Routine;
import com.glowguide.model.RoutineStep;
import com.glowguide.model.RoutineType;

import java.time.Instant;
import java.util.List;

public record RoutineResponse(String id, String name, RoutineType type, List<RoutineStep> steps,
                              Instant createdAt, Instant updatedAt) {
    public static RoutineResponse from(Routine routine) {
        return new RoutineResponse(routine.getId(), routine.getName(), routine.getType(), routine.getSteps(), routine.getCreatedAt(), routine.getUpdatedAt());
    }
}
