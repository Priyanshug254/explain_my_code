package com.emc.backend.controller;

import com.emc.backend.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/explain")
    public ResponseEntity<Map<String, String>> explain(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");
        String mode = payload.getOrDefault("mode", "beginner");
        String language = payload.getOrDefault("language", "english");

        String explanation = aiService.explainCode(code, mode, language);
        return ResponseEntity.ok(Map.of("explanation", explanation));
    }
}
