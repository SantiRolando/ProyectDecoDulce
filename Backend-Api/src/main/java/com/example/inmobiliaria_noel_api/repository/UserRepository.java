package com.example.inmobiliaria_noel_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.inmobiliaria_noel_api.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
    

}
