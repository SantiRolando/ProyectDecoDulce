package com.example.DecoDulce_Api.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.DecoDulce_Api.dtos.AdminOrderResponse;
import com.example.DecoDulce_Api.dtos.OrderRequest;
import com.example.DecoDulce_Api.dtos.OrderResponse;
import com.example.DecoDulce_Api.model.CustomerOrder;
import com.example.DecoDulce_Api.model.OrderStatus;
import com.example.DecoDulce_Api.service.OrderService;
import com.example.DecoDulce_Api.service.TransferProofStorageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
@Validated
public class OrderController {
    private final OrderService orderService;
    private final TransferProofStorageService proofStorageService;

    public OrderController(OrderService orderService, TransferProofStorageService proofStorageService) {
        this.orderService = orderService;
        this.proofStorageService = proofStorageService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody OrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(request));
    }

    @PostMapping(value = "/with-proof", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OrderResponse> createWithProof(
            @Valid @RequestPart("order") OrderRequest request,
            @RequestPart(value = "proof", required = false) MultipartFile proof) throws IOException {
        String filename = proof == null || proof.isEmpty() ? null : proofStorageService.store(proof);
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(request, filename));
        } catch (RuntimeException exception) {
            proofStorageService.delete(filename);
            throw exception;
        }
    }

    @GetMapping("/{id}")
    public CustomerOrder findById(@PathVariable Long id) {
        return orderService.findById(id);
    }

    @GetMapping
    public List<AdminOrderResponse> findAll() {
        return orderService.findAll();
    }

    @PatchMapping("/{id}/status/{status}")
    public AdminOrderResponse updateStatus(@PathVariable Long id, @PathVariable OrderStatus status) {
        return orderService.updateStatus(id, status);
    }

    @GetMapping("/{id}/transfer-proof")
    public ResponseEntity<Resource> getTransferProof(@PathVariable Long id) throws IOException {
        String filename = orderService.getTransferReceiptFilename(id);
        Resource resource = proofStorageService.load(filename);
        MediaType mediaType = filename.endsWith(".pdf") ? MediaType.APPLICATION_PDF
                : filename.endsWith(".png") ? MediaType.IMAGE_PNG : MediaType.IMAGE_JPEG;
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline().filename("comprobante-pedido-" + id + extension(filename)).build().toString())
                .body(resource);
    }

    private String extension(String filename) {
        return filename.substring(filename.lastIndexOf('.'));
    }
}