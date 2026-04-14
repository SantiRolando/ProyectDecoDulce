package com.example.DecoDulce_Api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.DecoDulce_Api.dtos.DtoUser;
import com.example.DecoDulce_Api.model.User;
import com.example.DecoDulce_Api.repository.UserRepository;
import com.example.DecoDulce_Api.util.JwtUtil;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Registra un usuario, codifica la contraseña y devuelve un token JWT.
     *
     * @param user objeto con email y password (sin codificar)
     * @return token JWT generado
     */
    public String registerUser(DtoUser user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new IllegalArgumentException("El email ya está en uso");
        }

        User user1 = new User();
        user1.setEmail(user.getEmail());
        user1.setNombre(user.getNombre());
        if(user.getRol() == null || user.getRol().isEmpty()) {
            user1.setRol("ROLE_USER"); // rol por defecto
        } else {
            user1.setRol(user.getRol());
        }
        

        // encriptar la contraseña antes de guardar
        user1.setPassword(passwordEncoder.encode(user.getPassword()));
                  // rol inicial
        user1.setActivo(true);
        userRepository.save(user1);

        // generar token manualmente porque Spring no lo hace por nosotros
        return jwtUtil.generateToken(user.getEmail(), user.getRol());
    }

    /**
     * Genera un JWT para un usuario ya existente, usado tras el login.
     */
    public String loginAndGetToken(String email) {
        User u = userRepository.findByEmail(email);
        if (u == null) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        return jwtUtil.generateToken(u.getEmail(), u.getRol());
    }


    public UserDetails loadUserByUsername(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRol().replace("ROLE_", "")) // eliminar "ROLE_" para Spring Security
                .build();
    }



}
