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

    public Long Id;
    public String Nombre;
    public String Email;
    public String Password;
    public String Rol;

    
}
