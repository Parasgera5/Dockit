package com.dokit.backend.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dokit.backend.entity.Document;
import com.dokit.backend.entity.ProcessingJob;
import com.dokit.backend.repository.DocumentRepository;
import com.dokit.backend.repository.ProcessingJobRepository;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ProcessingJobRepository jobRepository;
    private final com.dokit.backend.processor.DocumentProcessor documentProcessor;
    private final String UPLOAD_DIR = "uploads/";

    // Spring automatically injects the repository here (Constructor Injection)
    // public DocumentService(DocumentRepository documentRepository) {
    //     this.documentRepository = documentRepository;
    // }

    
    public DocumentService(DocumentRepository documentRepository,
            ProcessingJobRepository jobRepository,
            com.dokit.backend.processor.DocumentProcessor documentProcessor) {
        this.documentRepository = documentRepository;
        this.jobRepository = jobRepository;
        this.documentProcessor = documentProcessor;
    }

    // Notice the new UUID ownerId parameter
    public Document uploadDocument(MultipartFile file, UUID ownerId) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload an empty file");
        }

        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        Document doc = new Document();
        doc.setOriginalFilename(file.getOriginalFilename());
        doc.setContentType(file.getContentType());
        doc.setSizeBytes(file.getSize());
        doc.setStatus("QUEUED");
        doc.setOwnerId(ownerId); // <-- Attach the owner to the document!

        Document savedDoc = documentRepository.save(doc);

        Path filePath = Paths.get(UPLOAD_DIR + savedDoc.getId() + "_" + file.getOriginalFilename());
        Files.copy(file.getInputStream(), filePath);

        ProcessingJob job = new ProcessingJob(savedDoc.getId());
        job.setOwnerId(ownerId); // <-- Attach the owner to the background job!
        ProcessingJob savedJob = jobRepository.save(job);

        documentProcessor.processDocument(savedDoc.getId(), savedJob.getId(), filePath.toString());

        return savedDoc;
    }

    
    public List<Document> getUserDocuments(UUID ownerId) {
        return documentRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
    }
}
