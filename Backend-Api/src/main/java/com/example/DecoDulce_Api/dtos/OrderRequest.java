package com.example.DecoDulce_Api.dtos;
import java.util.List;

import com.example.DecoDulce_Api.model.PaymentMethod;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter @Setter @NoArgsConstructor
public class OrderRequest {
    @NotBlank private String customerName;
    @NotBlank private String phone;
    @NotBlank private String address;
    private String notes;
    @NotNull private PaymentMethod paymentMethod;
    private String transferReference;
    @NotEmpty @Valid private List<OrderItemRequest> items;
}