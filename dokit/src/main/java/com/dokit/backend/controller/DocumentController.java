package com.dokit.backend.controller;

import com.dokit.backend.entity.Document;
import com.dokit.backend.entity.User;
import com.dokit.backend.repository.UserRepository;
import com.dokit.backend.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;
    private final UserRepository userRepository;

    public DocumentController(DocumentService documentService, UserRepository userRepository) {
        this.documentService = documentService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Document>> getMyDocuments(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(documentService.getUserDocuments(user.getId()));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, Principal principal) {
        try {
            String email = principal.getName();
            User user = userRepository.findByEmail(email).orElseThrow();
            Document savedDoc = documentService.uploadDocument(file, user.getId());
            return ResponseEntity.ok(savedDoc);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }
}