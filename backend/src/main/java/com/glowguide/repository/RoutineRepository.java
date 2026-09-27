package com.glowguide.repository;

import com.glowguide.model.Routine;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RoutineRepository extends MongoRepository<Routine, String> {
    List<Routine> findByUserId(String userId);
    Optional<Routine> findByIdAndUserId(String id, String userId);
    void deleteByUserId(String userId);
}
