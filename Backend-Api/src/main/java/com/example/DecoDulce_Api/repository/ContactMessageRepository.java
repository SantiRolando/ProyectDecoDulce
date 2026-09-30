package com.example.DecoDulce_Api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.DecoDulce_Api.model.ContactMessage;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> { }