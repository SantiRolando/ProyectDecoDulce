package com.example.DecoDulce_Api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Cake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es requerido")
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @NotBlank(message = "La descripción es requerida")
    @Column(name = "descripcion", nullable = false, columnDefinition = "LONGTEXT")
    private String descripcion;
    
    @Column(name = "precio_base", nullable = false)
    private Double precioBase;

    @Column(name = "imagen", nullable = true)
    private String imagen;

    @Column(name = "categoria", nullable = false)
    private String categoria;

    @Column(name = "porciones")
    private String porciones;

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    
}


/*id
nombre
descripcion
precio_base
imagen
categoria
activo */