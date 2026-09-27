package com.glowguide.repository;

import com.glowguide.model.User;
import com.glowguide.model.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRolesContaining(Role role);

    Optional<User> findByProviderAndProviderId(com.glowguide.model.AuthProvider provider, String providerId);

    Page<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email, Pageable pageable);
}
