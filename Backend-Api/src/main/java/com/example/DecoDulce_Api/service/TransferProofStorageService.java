package com.example.DecoDulce_Api.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class TransferProofStorageService {
    private static final long MAX_FILE_SIZE = 8L * 1024 * 1024;
    private static final Map<String, byte[]> SIGNATURES = Map.of(
            "image/png", new byte[] {(byte) 0x89, 0x50, 0x4e, 0x47},
            "image/jpeg", new byte[] {(byte) 0xff, (byte) 0xd8, (byte) 0xff},
            "application/pdf", new byte[] {0x25, 0x50, 0x44, 0x46});
    private static final Map<String, String> EXTENSIONS = Map.of(
            "image/png", ".png",
            "image/jpeg", ".jpg",
            "application/pdf", ".pdf");

    private final Path directory;

    public TransferProofStorageService(@Value("${app.transfer-proofs.directory:uploads/transfer-proofs}") String directory) {
        this.directory = Paths.get(directory).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty() || file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Adjunta un comprobante de hasta 8 MB.");
        }

        String contentType = file.getContentType();
        String normalizedType = contentType == null ? "" : contentType.toLowerCase(Locale.ROOT);
        byte[] signature = SIGNATURES.get(normalizedType);
        byte[] bytes = file.getBytes();
        if (signature == null || !startsWith(bytes, signature)) {
            throw new IllegalArgumentException("El comprobante debe ser PDF, JPG o PNG válido.");
        }

        Files.createDirectories(directory);
        String filename = UUID.randomUUID() + EXTENSIONS.get(normalizedType);
        Files.write(directory.resolve(filename), bytes);
        return filename;
    }

    public Resource load(String filename) throws IOException {
        if (filename == null || !filename.matches("[0-9a-fA-F-]{36}\\.(pdf|jpg|png)")) {
            throw new IllegalArgumentException("Nombre de comprobante no válido");
        }
        Path path = directory.resolve(filename).normalize();
        if (!path.startsWith(directory) || !Files.exists(path)) {
            throw new IllegalArgumentException("No se encontró el archivo del comprobante");
        }
        return new UrlResource(path.toUri());
    }

    public void delete(String filename) throws IOException {
        if (filename != null && filename.matches("[0-9a-fA-F-]{36}\\.(pdf|jpg|png)")) {
            Files.deleteIfExists(directory.resolve(filename).normalize());
        }
    }

    private boolean startsWith(byte[] data, byte[] signature) {
        if (data.length < signature.length) return false;
        for (int index = 0; index < signature.length; index++) {
            if (data[index] != signature[index]) return false;
        }
        return true;
    }
}