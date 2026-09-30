package com.example.DecoDulce_Api.dtos;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter @Setter @NoArgsConstructor
public class OrderItemRequest {
    private Long cakeId;
    @Min(value = 1, message = "La cantidad debe ser mayor a cero") private Integer quantity = 1;
    private String customSize;
    private String customFlavor;
    private String customFilling;
    private String customTheme;
}