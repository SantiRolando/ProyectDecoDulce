package com.example.DecoDulce_Api.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.DecoDulce_Api.service.CakeImageStorageService;

@RestController
@RequestMapping("/api/cakes/images")
public class CakeImageController {
    private final CakeImageStorageService imageStorageService;

    public CakeImageController(CakeImageStorageService imageStorageService) {
        this.imageStorageService = imageStorageService;
    }

    @PostMapping
    public ResponseEntity<?> upload(@RequestParam("image") MultipartFile image) throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("url", imageStorageService.store(image)));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
        }
    }
}