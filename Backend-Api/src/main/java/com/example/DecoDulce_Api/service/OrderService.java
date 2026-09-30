package com.example.DecoDulce_Api.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.DecoDulce_Api.dtos.AdminOrderResponse;
import com.example.DecoDulce_Api.dtos.OrderItemRequest;
import com.example.DecoDulce_Api.dtos.OrderRequest;
import com.example.DecoDulce_Api.dtos.OrderResponse;
import com.example.DecoDulce_Api.model.Cake;
import com.example.DecoDulce_Api.model.CustomerOrder;
import com.example.DecoDulce_Api.model.OrderItem;
import com.example.DecoDulce_Api.model.OrderStatus;
import com.example.DecoDulce_Api.repository.CakeRepository;
import com.example.DecoDulce_Api.repository.CustomerOrderRepository;

@Service
public class OrderService {
    private final CustomerOrderRepository orderRepository;
    private final CakeRepository cakeRepository;

    public OrderService(CustomerOrderRepository orderRepository, CakeRepository cakeRepository) {
        this.orderRepository = orderRepository;
        this.cakeRepository = cakeRepository;
    }

    @Transactional
    public OrderResponse create(OrderRequest request) {
        return create(request, null);
    }

    @Transactional
    public OrderResponse create(OrderRequest request, String transferReceiptFilename) {
        if (request.getPaymentMethod().name().equals("TRANSFER")
                && (request.getTransferReference() == null || request.getTransferReference().isBlank())) {
            throw new IllegalArgumentException("La referencia de transferencia es obligatoria");
        }
        if (request.getPaymentMethod().name().equals("TRANSFER")
                && (transferReceiptFilename == null || transferReceiptFilename.isBlank())) {
            throw new IllegalArgumentException("Debes adjuntar el comprobante de transferencia");
        }

        CustomerOrder order = new CustomerOrder();
        order.setCustomerName(request.getCustomerName());
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress());
        order.setNotes(request.getNotes());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setTransferReference(request.getTransferReference());
        order.setTransferReceiptFilename(transferReceiptFilename);

        BigDecimal total = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.getItems()) {
            OrderItem item = new OrderItem();
            BigDecimal unitPrice;
            if (itemRequest.getCakeId() != null) {
                Cake cake = cakeRepository.findById(itemRequest.getCakeId())
                        .filter(c -> Boolean.TRUE.equals(c.getActivo()))
                        .orElseThrow(() -> new IllegalArgumentException("Producto no disponible: " + itemRequest.getCakeId()));
                unitPrice = BigDecimal.valueOf(cake.getPrecioBase());
                item.setCakeId(cake.getId());
                item.setProductName(cake.getNombre());
                item.setPortions(cake.getPorciones());
            } else {
                validateCustom(itemRequest);
                unitPrice = customPrice(itemRequest.getCustomSize());
                item.setProductName("Torta personalizada (" + itemRequest.getCustomSize() + ")");
                item.setPortions(itemRequest.getCustomSize());
                item.setCustomSize(itemRequest.getCustomSize());
                item.setCustomFlavor(itemRequest.getCustomFlavor());
                item.setCustomFilling(itemRequest.getCustomFilling());
                item.setCustomTheme(itemRequest.getCustomTheme());
            }
            item.setQuantity(itemRequest.getQuantity());
            item.setUnitPrice(unitPrice);
            order.addItem(item);
            total = total.add(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        order.setTotal(total);
        return toResponse(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<AdminOrderResponse> findAll() {
        List<CustomerOrder> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        List<Long> cakeIds = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .filter(item -> item.getPortions() == null && item.getCakeId() != null)
                .map(OrderItem::getCakeId)
                .distinct()
                .toList();
        Map<Long, String> currentPortions = cakeRepository.findAllById(cakeIds).stream()
            .filter(cake -> cake.getPorciones() != null)
                .collect(Collectors.toMap(Cake::getId, Cake::getPorciones));

        orders.forEach(order -> order.getItems().forEach(item -> {
            if (item.getPortions() == null && item.getCakeId() != null) {
                item.setPortions(currentPortions.get(item.getCakeId()));
            }
        }));

        return orders.stream()
                .map(AdminOrderResponse::from)
                .toList();
    }

    public String getTransferReceiptFilename(Long id) {
        CustomerOrder order = findById(id);
        if (order.getTransferReceiptFilename() == null) {
            throw new IllegalArgumentException("Este pedido no tiene comprobante adjunto");
        }
        return order.getTransferReceiptFilename();
    }

    public CustomerOrder findById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado"));
    }

    @Transactional
    public AdminOrderResponse updateStatus(Long id, OrderStatus status) {
        CustomerOrder order = findById(id);
        order.setStatus(status);
        CustomerOrder saved = orderRepository.save(order);
        return AdminOrderResponse.from(saved);
    }

    private void validateCustom(OrderItemRequest item) {
        if (item.getCustomSize() == null || item.getCustomSize().isBlank()
                || item.getCustomFlavor() == null || item.getCustomFlavor().isBlank()
                || item.getCustomFilling() == null || item.getCustomFilling().isBlank()
                || item.getCustomTheme() == null || item.getCustomTheme().isBlank()) {
            throw new IllegalArgumentException("Una torta personalizada requiere tamaño, bizcocho, relleno y temática");
        }
    }

    private BigDecimal customPrice(String size) {
        return switch (size) {
            case "6-8 porciones" -> BigDecimal.valueOf(900);
            case "10-12 porciones" -> BigDecimal.valueOf(1300);
            case "15-20 porciones" -> BigDecimal.valueOf(1800);
            case "25+ porciones" -> BigDecimal.valueOf(2400);
            default -> throw new IllegalArgumentException("Tamaño de torta personalizada no válido");
        };
    }

    private OrderResponse toResponse(CustomerOrder order) {
        return new OrderResponse(order.getId(), order.getTotal(), order.getStatus(), order.getCreatedAt());
    }
}