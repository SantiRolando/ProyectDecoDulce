package com.example.DecoDulce_Api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.DecoDulce_Api.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
    

}
