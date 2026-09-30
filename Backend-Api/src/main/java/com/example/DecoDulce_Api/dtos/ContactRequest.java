package com.example.DecoDulce_Api.dtos;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter @Setter @NoArgsConstructor
public class ContactRequest {
    @NotBlank private String name;
    @NotBlank @Email private String email;
    private String phone;
    @NotBlank private String message;
}