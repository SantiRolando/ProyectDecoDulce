package com.example.DecoDulce_Api.model;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity @Table(name = "custom_cake_requests") @Getter @Setter @NoArgsConstructor
public class CustomCakeRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String size;
    @Column(nullable = false) private String flavor;
    @Column(nullable = false) private String filling;
    @Column(nullable = false, length = 1000) private String theme;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal estimatedPrice;
    @Column(nullable = false, updatable = false) private LocalDateTime createdAt;
    @PrePersist void onCreate() { createdAt = LocalDateTime.now(); }
}