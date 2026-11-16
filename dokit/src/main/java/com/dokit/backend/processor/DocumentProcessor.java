package com.dokit.backend.processor;
import java.util.UUID;
import com.dokit.backend.entity.Document;
import com.dokit.backend.entity.ProcessingJob;
import com.dokit.backend.repository.DocumentRepository;
import com.dokit.backend.repository.ProcessingJobRepository;
import org.apache.tika.Tika;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDateTime;

@Service
public class DocumentProcessor {

    private final DocumentRepository documentRepository;
    private final ProcessingJobRepository jobRepository;
    private final Tika tika = new Tika();

    public DocumentProcessor(DocumentRepository documentRepository, ProcessingJobRepository jobRepository) {
        this.documentRepository = documentRepository;
        this.jobRepository = jobRepository;
    }

    @Async("jobExecutor")
    public void processDocument(UUID documentId, UUID jobId, String filePath) {
        ProcessingJob job = jobRepository.findById(jobId).orElseThrow();
        Document doc = documentRepository.findById(documentId).orElseThrow();

        try {
            // Update status to PROCESSING
            job.setStatus("PROCESSING");
            job.setUpdatedAt(LocalDateTime.now());
            jobRepository.save(job);

            doc.setStatus("PROCESSING");
            documentRepository.save(doc);

            // Simulate heavy processing so you can see it in real-time
            Thread.sleep(5000); 

            // Extract text using Apache Tika
            File file = new File(filePath);
            String text = tika.parseToString(file);

            // Update status to COMPLETED
            doc.setExtractedText(text);
            doc.setStatus("COMPLETED");
            documentRepository.save(doc);

            job.setStatus("COMPLETED");
            job.setUpdatedAt(LocalDateTime.now());
            jobRepository.save(job);

            System.out.println("✅ Successfully processed document: " + doc.getOriginalFilename());

        } catch (Exception e) {
            job.setAttemptCount(job.getAttemptCount() + 1);
            job.setErrorMessage(e.getMessage());
            
            if (job.getAttemptCount() >= job.getMaxAttempts()) {
                job.setStatus("FATAL_ERROR"); // Give up completely
            } else {
                job.setStatus("FAILED"); // Eligible for a retry
            }
            
            job.setUpdatedAt(LocalDateTime.now());
            jobRepository.save(job);
            
            doc.setStatus("FAILED");
            documentRepository.save(doc);
            
            System.err.println("❌ Failed to process document (Attempt " + job.getAttemptCount() + "): " + e.getMessage());
        }
    }
}