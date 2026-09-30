package com.example.DecoDulce_Api.dtos;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.DecoDulce_Api.model.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
@Getter @AllArgsConstructor
public class OrderResponse {
    private Long id;
    private BigDecimal total;
    private OrderStatus status;
    private LocalDateTime createdAt;
}