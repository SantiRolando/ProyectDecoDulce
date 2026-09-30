package com.example.DecoDulce_Api.dtos;
import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter @Setter @NoArgsConstructor
public class CustomCakeRequestDto {
    @NotBlank private String size;
    @NotBlank private String flavor;
    @NotBlank private String filling;
    @NotBlank private String theme;
    private BigDecimal estimatedPrice;
}