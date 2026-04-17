package com.example.DecoDulce_Api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    //Esta funcion se encarga de devolver mediante el Id del usuario la informacion del mismo,
    //Esta informacion es la que aparece en el perfil del usuario, y se puede acceder a ella mediante el endpoint /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<DtoUser> GetUserById(@PathVariable Long id) {
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

    //Esta funcion se encarga de actualizar la informacion del usuario, recibe un DtoUser con la nueva informacion del usuario, 
    // y se accede a ella mediante el endpoint /api/users/updateUser
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

