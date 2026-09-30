package com.example.DecoDulce_Api.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CakeImageStorageService {
    private static final long MAX_IMAGE_SIZE = 8L * 1024 * 1024;
    private static final long MAX_IMAGE_PIXELS = 25_000_000;
    private static final Map<String, String> IMAGE_EXTENSIONS = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/gif", ".gif");

    private final Path uploadDirectory;

    public CakeImageStorageService(@Value("${app.uploads.directory:uploads/cakes}") String directory) {
        this.uploadDirectory = Paths.get(directory).toAbsolutePath().normalize();
    }

    public String store(MultipartFile image) throws IOException {
        if (image.isEmpty() || image.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("La imagen debe pesar menos de 8 MB.");
        }

        String contentType = image.getContentType();
        String extension = contentType == null ? null : IMAGE_EXTENSIONS.get(contentType.toLowerCase(Locale.ROOT));
        if (extension == null) {
            throw new IllegalArgumentException("Formato no admitido. Usa una imagen JPG, PNG o GIF.");
        }

        byte[] bytes = image.getBytes();
        BufferedImage decoded = ImageIO.read(new ByteArrayInputStream(bytes));
        if (decoded == null || (long) decoded.getWidth() * decoded.getHeight() > MAX_IMAGE_PIXELS) {
            throw new IllegalArgumentException("El archivo no es una imagen válida o tiene dimensiones demasiado grandes.");
        }

        Files.createDirectories(uploadDirectory);
        String filename = UUID.randomUUID() + extension;
        Files.write(uploadDirectory.resolve(filename), bytes);
        return "/uploads/cakes/" + filename;
    }
}