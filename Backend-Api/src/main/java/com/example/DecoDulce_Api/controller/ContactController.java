package com.example.DecoDulce_Api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.DecoDulce_Api.dtos.ContactRequest;
import com.example.DecoDulce_Api.model.ContactMessage;
import com.example.DecoDulce_Api.repository.ContactMessageRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    private final ContactMessageRepository repository;

    public ContactController(ContactMessageRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public HttpStatus create(@Valid @RequestBody ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setPhone(request.getPhone());
        message.setMessage(request.getMessage());
        repository.save(message);
        return HttpStatus.CREATED;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR')")
    public List<ContactMessage> findAll() {
        return repository.findAll();
    }
}