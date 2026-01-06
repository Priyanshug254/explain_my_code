package com.emc.backend.service;

import org.eclipse.jgit.api.Git;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class GitService {

    private static final String UPLOAD_DIR = "uploads";

    public String cloneRepository(String repoUrl) throws IOException {
        String uploadId = UUID.randomUUID().toString();
        Path uploadPath = Paths.get(UPLOAD_DIR, uploadId);
        Files.createDirectories(uploadPath);

        try {
            Git.cloneRepository()
                    .setURI(repoUrl)
                    .setDirectory(uploadPath.toFile())
                    .setDepth(1) // Shallow clone for speed
                    .call();
            return uploadPath.toAbsolutePath().toString();
        } catch (Exception e) {
            throw new IOException("Failed to clone repository: " + e.getMessage(), e);
        }
    }
}
