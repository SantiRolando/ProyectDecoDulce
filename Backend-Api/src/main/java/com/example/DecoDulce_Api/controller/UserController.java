package com.example.DecoDulce_Api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.DecoDulce_Api.dtos.DtoUser;
import com.example.DecoDulce_Api.service.UserService;


@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<DtoUser> GetUser(Authentication authentication) {
        DtoUser user = userService.findByUsername(authentication.getName());
        if(user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DtoUser> GetUserById(Long id) {
        DtoUser user = userService.findById(id);
        if(user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/GetAllUsers")
    public ResponseEntity<?> GetAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }


    @PutMapping("/updateUser")
    public ResponseEntity<DtoUser> UpdateUser(Authentication authentication, @RequestBody DtoUser user) {
        DtoUser currentUser = userService.findByUsername(authentication.getName());
        if(currentUser == null) {
            return ResponseEntity.notFound().build();
        }
        Long id = currentUser.getId();
        DtoUser updated = userService.updateUser(id, user);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/dropUser")
    public ResponseEntity<?> DropUser(Authentication authentication) {
        DtoUser currentUser = userService.findByUsername(authentication.getName());
        if(currentUser == null) {
            return ResponseEntity.notFound().build();
        }
        boolean deleted = userService.dropUser(currentUser.getId());
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    }

