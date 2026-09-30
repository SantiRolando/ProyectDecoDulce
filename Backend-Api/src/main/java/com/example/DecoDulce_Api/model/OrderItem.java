package com.example.DecoDulce_Api.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false) @JoinColumn(name = "order_id", nullable = false)
    private CustomerOrder order;
    private Long cakeId;
    @Column(nullable = false) private String productName;
    @Column(nullable = false) private Integer quantity;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal unitPrice;
    private String portions;
    private String customSize;
    private String customFlavor;
    private String customFilling;
    @Column(length = 1000) private String customTheme;
}