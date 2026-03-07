package com.example.inmobiliaria_noel_api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.inmobiliaria_noel_api.dtos.DtoUser;
import com.example.inmobiliaria_noel_api.model.User;
import com.example.inmobiliaria_noel_api.service.UserService;

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
        return userService.registerUser(user);
    }

    /**
     * Valida las credenciales y retorna un token si son correctas.
     */
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
        );
        // si llegamos aquí la autenticación fue exitosa
        return userService.loginAndGetToken(user.getEmail());
    }
}