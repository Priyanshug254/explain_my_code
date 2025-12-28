package com.emc.backend.model;

import java.util.ArrayList;
import java.util.List;

public class FileNode {
    private String name;
    private String path;
    private String type; // FILE or DIRECTORY
    private List<FileNode> children = new ArrayList<>();
    private String content; // Optional: Only populated for small files or on demand

    public FileNode() {
    }

    public FileNode(String name, String path, String type) {
        this.name = name;
        this.path = path;
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<FileNode> getChildren() {
        return children;
    }

    public void setChildren(List<FileNode> children) {
        this.children = children;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
