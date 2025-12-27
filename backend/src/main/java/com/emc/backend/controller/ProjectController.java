package com.emc.backend.controller;

import com.emc.backend.model.FileNode;
import com.emc.backend.service.FileService;
import com.emc.backend.service.ParserService;
import com.emc.backend.service.GitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/project")
@CrossOrigin(origins = "*") // Allow all for dev
public class ProjectController {

    private final FileService fileService;
    private final ParserService parserService;
    private final GitService gitService; // New Dependency

    public ProjectController(FileService fileService, ParserService parserService, GitService gitService) {
        this.fileService = fileService;
        this.parserService = parserService;
        this.gitService = gitService;
    }

    @PostMapping("/clone")
    public ResponseEntity<FileNode> cloneProject(@RequestBody Map<String, String> payload) {
        String url = payload.get("url");
        if (url == null || url.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            String projectPath = gitService.cloneRepository(url);
            FileNode tree = parserService.parseDirectory(projectPath);
            return ResponseEntity.ok(tree);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<FileNode> uploadProject(@RequestParam("file") MultipartFile file) {
        try {
            String projectPath = fileService.saveAndUnzip(file);
            FileNode tree = parserService.parseDirectory(projectPath);
            return ResponseEntity.ok(tree);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/file")
    public ResponseEntity<Map<String, String>> getFileContent(@RequestParam("path") String path) {
        try {
            String content = fileService.readFileContent(path);
            return ResponseEntity.ok(Map.of("content", content));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "File not found or unreadable"));
        }
    }
}
