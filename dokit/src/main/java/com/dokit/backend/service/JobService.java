package com.dokit.backend.service;

import com.dokit.backend.entity.Document;
import com.dokit.backend.entity.ProcessingJob;
import com.dokit.backend.processor.DocumentProcessor;
import com.dokit.backend.repository.DocumentRepository;
import com.dokit.backend.repository.ProcessingJobRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class JobService {

    private final ProcessingJobRepository jobRepository;
    private final DocumentRepository documentRepository;
    private final DocumentProcessor documentProcessor;

    public JobService(ProcessingJobRepository jobRepository, DocumentRepository documentRepository, DocumentProcessor documentProcessor) {
        this.jobRepository = jobRepository;
        this.documentRepository = documentRepository;
        this.documentProcessor = documentProcessor;
    }

    public List<ProcessingJob> getUserJobs(UUID ownerId) {
        return jobRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    public ProcessingJob retryJob(UUID jobId, UUID ownerId) {
        ProcessingJob job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        // IDOR Security Check: Ensure the logged-in user actually owns this job!
        if (!job.getOwnerId().equals(ownerId)) {
            throw new SecurityException("Access denied: You do not own this job.");
        }

        if (!job.getStatus().equals("FAILED")) {
            throw new IllegalStateException("Only FAILED jobs can be retried. Current status: " + job.getStatus());
        }
        if (job.getAttemptCount() >= job.getMaxAttempts()) {
            throw new IllegalStateException("Maximum retry attempts reached.");
        }

        job.setStatus("QUEUED");
        jobRepository.save(job);

        Document doc = documentRepository.findById(job.getDocumentId()).orElseThrow();
        doc.setStatus("QUEUED");
        documentRepository.save(doc);

        String filePath = "uploads/" + doc.getId() + "_" + doc.getOriginalFilename();
        documentProcessor.processDocument(doc.getId(), job.getId(), filePath);

        return job;
    }
}