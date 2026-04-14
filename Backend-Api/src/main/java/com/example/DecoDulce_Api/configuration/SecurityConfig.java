package com.example.DecoDulce_Api.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.DecoDulce_Api.service.CustomUserDetailsService;
import com.example.DecoDulce_Api.util.JwTFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    @Autowired
    private JwTFilter jwtFilter;

    //Para cifrar las contraseñas de los usuarios antes de almacenarlas en la base de datos y para verificar 
    // las contraseñas durante el proceso de autenticación. 
    // BCrypt es un algoritmo de hashing fuerte que incluye un salt incorporado, lo que lo hace resistente a 
    // ataques de fuerza bruta y rainbow tables.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //Proporciona el AuthenticationManager necesario para el proceso de autenticación, permitiendo 
    // que Spring Security maneje la autenticación de usuarios.
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    //Configura un DaoAuthenticationProvider que utiliza el CustomUserDetailsService 
    // para cargar los detalles del usuario y el PasswordEncoder para verificar las contraseñas.
    @Bean
public AuthenticationProvider authenticationProvider(UserDetailsService customUserDetailsService, PasswordEncoder passwordEncoder) {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider(customUserDetailsService);
    provider.setPasswordEncoder(passwordEncoder);
    return provider;
}


    //Configura las reglas de seguridad HTTP, definiendo qué endpoints son públicos y 
    // cuáles requieren autenticación y roles específicos.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception
    {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests((requests) -> requests

                // Acceso público
                .requestMatchers("/api/auth/login", "/api/auth/register", "/api/cakes/getAllCakes").permitAll()

                // GET propiedades
                .requestMatchers(HttpMethod.GET, "/api/properties")
                    .hasAnyRole("USER", "GESTOR", "ADMIN")

                // POST crear
                .requestMatchers(HttpMethod.POST, "/api/properties/newCake")
                    .hasAnyRole("GESTOR", "ADMIN")

                // PUT editar
                .requestMatchers(HttpMethod.PUT, "/api/properties/newCake", "/api/properties/updateCake/**")
                    .hasAnyRole("GESTOR", "ADMIN")

                // DELETE eliminar
                .requestMatchers(HttpMethod.DELETE, "/api/properties/deleteCake/**")
                    .hasRole("ADMIN")

                .anyRequest().authenticated()
            )
             .authenticationProvider(authenticationProvider(customUserDetailsService, passwordEncoder()))
             .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}