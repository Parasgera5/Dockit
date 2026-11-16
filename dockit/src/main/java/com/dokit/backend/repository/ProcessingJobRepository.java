package com.dokit.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dokit.backend.entity.ProcessingJob;

@Repository
public interface ProcessingJobRepository extends JpaRepository<ProcessingJob, UUID> {
    List<ProcessingJob> findByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
}