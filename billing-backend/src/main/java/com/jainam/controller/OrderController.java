package com.jainam.controller;

import com.jainam.dto.OrderDTO;
import com.jainam.entity.Order.OrderStatus;
import com.jainam.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" })
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getVisibleOrders(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @RequestHeader(value = "X-Username", required = false) String username) {
        return ResponseEntity.ok(orderService.getVisibleOrders(role, username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/new-count")
    public ResponseEntity<Map<String, Long>> getNewOrderCount(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @RequestHeader(value = "X-Username", required = false) String username) {
        return ResponseEntity.ok(Map.of("count", orderService.countNewOrders(role, username)));
    }

    // Placed by a client from the storefront cart. The client is identified
    // by X-Username (their storefront login) — the order is auto-routed to
    // the marketing member who owns that client.
    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody OrderDTO orderDTO,
            @RequestHeader(value = "X-Username", required = false) String username) {
        if (username == null || username.isBlank()) {
            return ResponseEntity.status(401).body("Not logged in");
        }
        try {
            return ResponseEntity.ok(orderService.createOrder(orderDTO, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @PathVariable OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
