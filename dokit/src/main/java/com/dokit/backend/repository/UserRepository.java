package com.dokit.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dokit.backend.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    // Spring Data JPA automatically writes the SQL for this based on the method name!
    Optional<User> findByEmail(String email);
}