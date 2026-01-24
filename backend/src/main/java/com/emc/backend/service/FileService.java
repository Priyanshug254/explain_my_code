package com.emc.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.nio.file.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.UUID;

@Service
public class FileService {

    private static final String UPLOAD_DIR = "uploads";

    public String saveAndUnzip(MultipartFile file) throws IOException {
        String uploadId = UUID.randomUUID().toString();
        Path uploadPath = Paths.get(UPLOAD_DIR, uploadId);
        Files.createDirectories(uploadPath);

        // Save zip file
        Path zipPath = uploadPath.resolve("project.zip");
        if (zipPath == null) {
            throw new IOException("Failed to create zip path");
        }
        file.transferTo(zipPath);

        // Unzip
        unzip(zipPath.toFile(), uploadPath.toFile());

        // Return absolute path to the extracted folder
        return uploadPath.toAbsolutePath().toString();
    }

    private void unzip(File zipFile, File destDir) throws IOException {
        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile))) {
            ZipEntry zipEntry = zis.getNextEntry();
            while (zipEntry != null) {
                File newFile = new File(destDir, zipEntry.getName());
                // Security check for Zip Slip
                String destDirPath = destDir.getCanonicalPath();
                String newFilePath = newFile.getCanonicalPath();
                if (!newFilePath.startsWith(destDirPath + File.separator)) {
                    throw new IOException("Entry is outside of the target dir: " + zipEntry.getName());
                }

                if (zipEntry.isDirectory()) {
                    if (!newFile.isDirectory() && !newFile.mkdirs()) {
                        throw new IOException("Failed to create directory " + newFile);
                    }
                } else {
                    // fix for Windows-created archives
                    File parent = newFile.getParentFile();
                    if (!parent.isDirectory() && !parent.mkdirs()) {
                        throw new IOException("Failed to create directory " + parent);
                    }
                    try (FileOutputStream fos = new FileOutputStream(newFile)) {
                        byte[] buffer = new byte[1024];
                        int len;
                        while ((len = zis.read(buffer)) > 0) {
                            fos.write(buffer, 0, len);
                        }
                    }
                }
                zipEntry = zis.getNextEntry();
            }
            zis.closeEntry();
        }
    }

    public String readFileContent(String filePath) throws IOException {
        return Files.readString(Paths.get(filePath));
    }
}
