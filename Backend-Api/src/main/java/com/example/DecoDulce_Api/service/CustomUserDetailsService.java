package com.example.DecoDulce_Api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.DecoDulce_Api.model.User;
import com.example.DecoDulce_Api.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("Usuario no encontrado: " + username);
        }
        // el método roles() espera sin el prefijo ROLE_
       String roleWithoutPrefix = user.getRol()
        .replace("ROLE_", "")
        .toUpperCase();

        UserDetails userDetails = org.springframework.security.core.userdetails.User
        .withUsername(user.getEmail())
        .password(user.getPassword())
        .roles(roleWithoutPrefix)
        .build();

    // DEBUG 👇
    System.out.println("Authorities generadas: " + userDetails.getAuthorities());

    return userDetails;

    }
}