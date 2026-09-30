package com.example.DecoDulce_Api.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.DecoDulce_Api.model.CustomerOrder;
import com.example.DecoDulce_Api.model.OrderItem;
import com.example.DecoDulce_Api.model.OrderStatus;
import com.example.DecoDulce_Api.model.PaymentMethod;

public record AdminOrderResponse(
        Long id,
        String customerName,
        String phone,
        String address,
        String notes,
        PaymentMethod paymentMethod,
        String transferReference,
        boolean transferReceiptAvailable,
        BigDecimal total,
        OrderStatus status,
        LocalDateTime createdAt,
        List<AdminOrderItemResponse> items) {

    public static AdminOrderResponse from(CustomerOrder order) {
        List<AdminOrderItemResponse> items = order.getItems().stream()
                .map(AdminOrderItemResponse::from)
                .toList();
        return new AdminOrderResponse(order.getId(), order.getCustomerName(), order.getPhone(),
                order.getAddress(), order.getNotes(), order.getPaymentMethod(), order.getTransferReference(),
                order.getTransferReceiptFilename() != null, order.getTotal(), order.getStatus(),
                order.getCreatedAt(), items);
    }

    public record AdminOrderItemResponse(
            Long id,
            String productName,
            Integer quantity,
            BigDecimal unitPrice,
            String portions,
            String customSize,
            String customFlavor,
            String customFilling,
            String customTheme) {
        private static AdminOrderItemResponse from(OrderItem item) {
            return new AdminOrderItemResponse(item.getId(), item.getProductName(), item.getQuantity(),
                    item.getUnitPrice(), item.getPortions(), item.getCustomSize(), item.getCustomFlavor(),
                    item.getCustomFilling(), item.getCustomTheme());
        }
    }
}