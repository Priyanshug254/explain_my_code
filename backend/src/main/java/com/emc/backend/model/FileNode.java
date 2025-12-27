package com.emc.backend.model;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class FileNode {
    private String name;
    private String path;
    private String type; // FILE or DIRECTORY
    private List<FileNode> children = new ArrayList<>();
    private String content; // Optional: Only populated for small files or on demand

    public FileNode(String name, String path, String type) {
        this.name = name;
        this.path = path;
        this.type = type;
    }
}
