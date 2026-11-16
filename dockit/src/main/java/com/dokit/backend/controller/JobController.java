package com.dokit.backend.controller;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dokit.backend.entity.ProcessingJob;
import com.dokit.backend.entity.User;
import com.dokit.backend.repository.UserRepository;
import com.dokit.backend.service.JobService;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final UserRepository userRepository;

    public JobController(JobService jobService, UserRepository userRepository) {
        this.jobService = jobService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<ProcessingJob>> getMyJobs(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(jobService.getUserJobs(user.getId()));
    }

    @PostMapping("/{id}/retry")
    public ResponseEntity<?> retryFailedJob(@PathVariable UUID id, Principal principal) {
        try {
            User user = userRepository.findByEmail(principal.getName()).orElseThrow();
            ProcessingJob retriedJob = jobService.retryJob(id, user.getId());
            return ResponseEntity.ok(retriedJob);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}