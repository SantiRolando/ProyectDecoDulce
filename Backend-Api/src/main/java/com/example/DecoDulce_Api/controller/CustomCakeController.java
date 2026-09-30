package com.example.DecoDulce_Api.controller;

import java.math.BigDecimal;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.DecoDulce_Api.dtos.CustomCakeRequestDto;
import com.example.DecoDulce_Api.model.CustomCakeRequest;
import com.example.DecoDulce_Api.repository.CustomCakeRequestRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/custom-cakes")
public class CustomCakeController {
    private final CustomCakeRequestRepository repository;

    public CustomCakeController(CustomCakeRequestRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public CustomCakeRequest create(@Valid @RequestBody CustomCakeRequestDto request) {
        CustomCakeRequest entity = new CustomCakeRequest();
        entity.setSize(request.getSize());
        entity.setFlavor(request.getFlavor());
        entity.setFilling(request.getFilling());
        entity.setTheme(request.getTheme());
        entity.setEstimatedPrice(customPrice(request.getSize()));
        return repository.save(entity);
    }

    private BigDecimal customPrice(String size) {
        return switch (size) {
            case "6-8 porciones" -> BigDecimal.valueOf(900);
            case "10-12 porciones" -> BigDecimal.valueOf(1300);
            case "15-20 porciones" -> BigDecimal.valueOf(1800);
            case "25+ porciones" -> BigDecimal.valueOf(2400);
            default -> throw new IllegalArgumentException("Tamaño de torta personalizada no válido");
        };
    }
}