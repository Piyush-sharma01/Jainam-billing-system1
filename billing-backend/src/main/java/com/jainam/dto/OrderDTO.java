package com.jainam.dto;

import com.jainam.entity.Order.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private ClientDTO client;
    private String assignedTo;
    private List<OrderItemDTO> items = new ArrayList<>();
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal grandTotal;
    private OrderStatus status;
    private String notes;
    private LocalDateTime createdAt;
}
