package com.example.DecoDulce_Api.service;

import java.util.ArrayList;
import java.util.List;

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

  
    //==================================SECTOR AUTH===========================================//
  
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
        user1.setRol("ROLE_USER");
        

        // encriptar la contraseña antes de guardar
        user1.setPassword(passwordEncoder.encode(user.getPassword()));
                  // rol inicial
        user1.setActivo(true);
        userRepository.save(user1);

        // generar token manualmente porque Spring no lo hace por nosotros
        return "TOKEN: " + jwtUtil.generateToken(user.getEmail(), user1.getRol());
    }

    /**
     * Genera un JWT para un usuario ya existente, usado tras el login.
     */
    public String loginAndGetToken(String email) {
        User u = userRepository.findByEmail(email);
        if (u == null) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        return "TOKEN: " + jwtUtil.generateToken(u.getEmail(), u.getRol());
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

    //==============================================================================================//


    //==========================================SECTOR FIND=================================================//

  public DtoUser findByUsername(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return null;
        }
        DtoUser dtoUser = new DtoUser();
        dtoUser.setId(user.getId());
        dtoUser.setEmail(user.getEmail());
        dtoUser.setNombre(user.getNombre());
        dtoUser.setRol(user.getRol());
        return dtoUser;
    }

    public DtoUser findById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }
        DtoUser dtoUser = new DtoUser();
        dtoUser.setId(user.getId());
        dtoUser.setEmail(user.getEmail());
        dtoUser.setNombre(user.getNombre());
        dtoUser.setRol(user.getRol());
        return dtoUser;
    }

    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email) != null;
    }
    //==============================================================================================//



    //============================================SECTOR GET===============================================//
    public DtoUser getCurrentUser(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }
        DtoUser dtoUser = new DtoUser();
        dtoUser.setId(user.getId());
        dtoUser.setEmail(user.getEmail());
        dtoUser.setNombre(user.getNombre());
        dtoUser.setRol(user.getRol());
        return dtoUser;
    }

    public Iterable<DtoUser> getAllUsers() {
        Iterable<User> users = userRepository.findAll();
        List<DtoUser> dtoUsers = new ArrayList<>();
        for (User user : users) {
            DtoUser dtoUser = new DtoUser();
            dtoUser.setId(user.getId());
            dtoUser.setEmail(user.getEmail());
            dtoUser.setNombre(user.getNombre());
            dtoUser.setRol(user.getRol());
            dtoUsers.add(dtoUser);
        }
        return dtoUsers;
    }
    //==============================================================================================//


    //============================================SECTOR UPDATE===============================================//
    public DtoUser updateUser(Long id, DtoUser updatedUser) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }
        user.setNombre(updatedUser.getNombre());
        user.setEmail(updatedUser.getEmail());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        if (updatedUser.getRol() != null && !updatedUser.getRol().isEmpty()) {
            user.setRol(updatedUser.getRol());
        }
        userRepository.save(user);

        DtoUser dtoUser = new DtoUser();
        dtoUser.setId(user.getId());
        dtoUser.setEmail(user.getEmail());
        dtoUser.setNombre(user.getNombre());
        dtoUser.setRol(user.getRol());
        return dtoUser;
    }

    public boolean dropUser(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return false;
        }
        user.setActivo(false);
        userRepository.save(user);
        return true;
    }

        //==============================================================================================//


}
