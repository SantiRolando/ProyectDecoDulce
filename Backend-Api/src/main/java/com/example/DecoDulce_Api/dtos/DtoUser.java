package com.example.DecoDulce_Api.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DtoUser {

    private Long id;
    private String nombre;
    private String email;
    private String password;
    private String rol;


    //Constructor para login (solo email y password)
    public DtoUser(String email, String password) {
        this.email = email;
        this.password = password;
    }

    //Constructor para registro (nombre, email, password)
    public DtoUser(String nombre, String email, String password) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
    }

}

