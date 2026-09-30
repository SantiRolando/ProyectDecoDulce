package com.example.DecoDulce_Api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.DecoDulce_Api.dtos.DtoUser;
import com.example.DecoDulce_Api.exception.EmailAlreadyExistsException;
import com.example.DecoDulce_Api.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Registra y devuelve el token JWT recién creado.
     */
    @PostMapping("/register")
    public String register(@RequestBody DtoUser user) {
        if (userService.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyExistsException("El email ya está en uso");
        }
        return userService.registerUser(user);
    }

    /**
     * Valida las credenciales y retorna un token si son correctas.
     */
    @PostMapping("/login")
    public String login(@RequestBody DtoUser user) {
        System.out.println("Intentando login para: " + user.getEmail());
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
        );
        
        // si llegamos aquí la autenticación fue exitosa
        return userService.loginAndGetToken(user.getEmail());
    }
}