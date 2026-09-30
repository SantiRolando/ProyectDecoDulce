package com.example.DecoDulce_Api.configuration;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.DecoDulce_Api.model.Cake;
import com.example.DecoDulce_Api.model.User;
import com.example.DecoDulce_Api.repository.CakeRepository;
import com.example.DecoDulce_Api.repository.UserRepository;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seedCatalog(CakeRepository repository) {
        return args -> {
            if (repository.count() > 0) return;
            repository.saveAll(List.of(
                cake("Chocolate Clásico", "Bizcocho húmedo de cacao amargo, relleno de dulce de leche artesanal y cobertura de ganache.", 1200, "Clásicas", "10-12 porciones", "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"),
                cake("Frutos Rojos y Crema", "Bizcocho de vainilla, crema chantilly y frutos rojos frescos.", 1300, "Especiales", "12-15 porciones", "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80"),
                cake("Dulce de Leche Crunchy", "Bizcocho de vainilla, dulce de leche y corazón crocante de almendras.", 1100, "Clásicas", "10 porciones", "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"),
                cake("Torta Oreo Supreme", "Capas de chocolate, frosting de galletas Oreo y mini Oreos.", 1250, "Especiales", "12 porciones", "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80"),
                cake("Cumpleaños Temática Aniversario", "Torta festiva de dos pisos con buttercream y detalles dorados.", 2100, "Cumpleaños", "20-25 porciones", "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=80"),
                cake("Red Velvet Clásica", "Bizcocho rojo aterciopelado con frosting de queso crema.", 1400, "Especiales", "10-12 porciones", "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80"),
                cake("Design Cake Personalizada", "Torta a medida con diseño libre según la temática del evento.", 1800, "Personalizadas", "15 porciones", "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"),
                cake("Chocotorta Familiar", "Chocolinas, dulce de leche y queso crema en una receta clásica.", 950, "Clásicas", "8-10 porciones", "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80")
            ));
        };
    }

    @Bean
    CommandLineRunner seedAdmin(
            UserRepository repository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email:}") String email,
            @Value("${app.admin.password:}") String password,
            @Value("${app.admin.name:Administrador Deco Dulce}") String name) {
        return args -> {
            if (email.isBlank() || password.isBlank() || repository.findByEmail(email) != null) return;

            User admin = new User();
            admin.setNombre(name);
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode(password));
            admin.setRol("ROLE_ADMIN");
            admin.setActivo(true);
            repository.save(admin);
        };
    }

    private Cake cake(String name, String description, double price, String category, String portions, String image) {
        Cake cake = new Cake();
        cake.setNombre(name);
        cake.setDescripcion(description);
        cake.setPrecioBase(price);
        cake.setCategoria(category);
        cake.setPorciones(portions);
        cake.setImagen(image);
        cake.setActivo(true);
        return cake;
    }
}