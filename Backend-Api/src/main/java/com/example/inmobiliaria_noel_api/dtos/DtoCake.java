package com.example.inmobiliaria_noel_api.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DtoCake {
    private Long id;
    private String nombre;
    private String descripcion;
    private double precioBase;
    private String imagen;
    private String categoria;
    private Boolean activo;
}

/*id
nombre
descripcion
precio_base
imagen
categoria
activo */