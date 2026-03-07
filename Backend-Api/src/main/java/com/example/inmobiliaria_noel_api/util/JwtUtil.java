package com.example.inmobiliaria_noel_api.util;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // se inyecta desde application.properties
    @Value("${jwt.secret:mi_clave_super_secreta_para_jwt_2026_segura")
    private String secret;

    // duración del token en milisegundos (ej. 1h)
    @Value("${jwt.expiration:3600000}")
    private long expiration;

      public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .compact();
    }


    //Comprueba que el token corresponde al usuario esperado y que no ha expirado.
    public boolean validateToken(String token, String username) {
        return username.equals(extractUsername(token)) && !isTokenExpired(token);
    }

    
    //Ayudan a leer información del token (username, rol, fecha, …) usando la misma clave secreta.
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    //Extrae todos los reclamos (claims) del token, que incluyen el sujeto (username), rol y fechas de emisión y expiración.
    public Claims extractAllClaims(String token) {
    return Jwts
            .parser()
            .verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
            .build()
            .parseSignedClaims(token)
            .getPayload();
}

    //Verifica si el token ya caducó comparando su fecha de expiración con el momento actual.
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }
}
