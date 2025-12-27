package com.emc.backend.service;

import com.emc.backend.model.FileNode;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Arrays;
import java.util.Comparator;

@Service
public class ParserService {

    public FileNode parseDirectory(String rootPath) {
        File rootFile = new File(rootPath);
        if (!rootFile.exists()) {
            throw new IllegalArgumentException("Path does not exist: " + rootPath);
        }
        return buildFileTree(rootFile);
    }

    private FileNode buildFileTree(File file) {
        // Skip .git folders, node_modules, etc to keep it clean
        if (shouldSkip(file.getName())) {
            return null;
        }

        String type = file.isDirectory() ? "DIRECTORY" : "FILE";
        FileNode node = new FileNode(file.getName(), file.getAbsolutePath(), type);

        if (file.isDirectory()) {
            File[] children = file.listFiles();
            if (children != null) {
                Arrays.stream(children)
                        .sorted(Comparator.comparing(File::getName)) // Sort for consistency
                        .forEach(child -> {
                            FileNode childNode = buildFileTree(child);
                            if (childNode != null) {
                                node.getChildren().add(childNode);
                            }
                        });
            }
        }
        return node;
    }

    private boolean shouldSkip(String name) {
        return name.equals(".git") ||
                name.equals("node_modules") ||
                name.equals("target") ||
                name.equals("dist") ||
                name.equals(".idea") ||
                name.equals("__pycache__");
    }
}
