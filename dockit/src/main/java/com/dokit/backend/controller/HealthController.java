package com.dokit.backend.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public Map<String, String> healthCheck() {
        return Map.of("status", "System Operational", "service", "Dokit Core API");
    }
}