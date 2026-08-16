package com.jainam.service;

import com.jainam.dto.ClientDTO;
import com.jainam.dto.OrderDTO;
import com.jainam.dto.OrderItemDTO;
import com.jainam.entity.Client;
import com.jainam.entity.Order;
import com.jainam.entity.Order.OrderStatus;
import com.jainam.entity.OrderItem;
import com.jainam.entity.Product;
import com.jainam.repository.ClientRepository;
import com.jainam.repository.OrderRepository;
import com.jainam.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ProductRepository productRepository;

    // Orders visible to the caller:
    //  - CLIENT: only their own orders (identified by their storefront username)
    //  - MARKETING: only orders routed to them (assignedTo == their username)
    //  - ADMIN / owner: everything
    public List<OrderDTO> getVisibleOrders(String role, String username) {
        List<Order> orders;
        if ("CLIENT".equalsIgnoreCase(role) && username != null) {
            Client client = clientRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Client not found"));
            orders = orderRepository.findByClientIdOrderByCreatedAtDesc(client.getId());
        } else if ("MARKETING".equalsIgnoreCase(role) && username != null) {
            orders = orderRepository.findByAssignedToOrderByCreatedAtDesc(username);
        } else {
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        }
        return orders.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDTO(order);
    }

    // Placed by a logged-in client from the storefront. The client is
    // identified by their storefront username (X-Username header), and the
    // order is automatically routed to whichever marketing member (or
    // "owner") originally added that client — never created as an invoice.
    public OrderDTO createOrder(OrderDTO orderDTO, String clientUsername) {
        Client client = clientRepository.findByUsername(clientUsername)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        if (orderDTO.getItems() == null || orderDTO.getItems().isEmpty()) {
            throw new RuntimeException("Order must have at least one item");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal taxAmount = BigDecimal.ZERO;

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setClient(client);
        order.setAssignedTo(client.getCreatedBy() != null ? client.getCreatedBy() : "owner");
        order.setStatus(OrderStatus.NEW);
        order.setNotes(orderDTO.getNotes());

        java.util.List<OrderItem> items = new java.util.ArrayList<>();
        for (OrderItemDTO itemDTO : orderDTO.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDTO.getProductId()));

            int qty = itemDTO.getQuantity() == null ? 1 : itemDTO.getQuantity();
            BigDecimal unitPrice = product.getPrice();
            BigDecimal lineSubtotal = unitPrice.multiply(BigDecimal.valueOf(qty)).setScale(2, RoundingMode.HALF_UP);
            BigDecimal gstPct = product.getGst() == null ? BigDecimal.ZERO : product.getGst();
            BigDecimal lineTax = lineSubtotal.multiply(gstPct).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal lineTotal = lineSubtotal.add(lineTax);

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(qty)
                    .unitPrice(unitPrice)
                    .gstPercentage(gstPct)
                    .subtotal(lineSubtotal)
                    .taxAmount(lineTax)
                    .total(lineTotal)
                    .build();
            items.add(item);

            subtotal = subtotal.add(lineSubtotal);
            taxAmount = taxAmount.add(lineTax);
        }

        order.setItems(items);
        order.setSubtotal(subtotal);
        order.setTaxAmount(taxAmount);
        order.setGrandTotal(subtotal.add(taxAmount));

        Order saved = orderRepository.save(order);
        return convertToDTO(saved);
    }

    public OrderDTO updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return convertToDTO(orderRepository.save(order));
    }

    // Count of NEW orders waiting on this marketing member (or all, for the
    // owner) — used for a badge/notification count in the sidebar.
    public long countNewOrders(String role, String username) {
        if ("MARKETING".equalsIgnoreCase(role) && username != null) {
            return orderRepository.countByAssignedToAndStatus(username, OrderStatus.NEW);
        }
        return orderRepository.countByStatus(OrderStatus.NEW);
    }

    private String generateOrderNumber() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long countToday = orderRepository.count() + 1;
        return "ORD-" + datePart + "-" + String.format("%04d", countToday);
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setClient(convertClientToDTO(order.getClient()));
        dto.setAssignedTo(order.getAssignedTo());
        dto.setSubtotal(order.getSubtotal());
        dto.setTaxAmount(order.getTaxAmount());
        dto.setGrandTotal(order.getGrandTotal());
        dto.setStatus(order.getStatus());
        dto.setNotes(order.getNotes());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setItems(order.getItems().stream().map(this::convertItemToDTO).collect(Collectors.toList()));
        return dto;
    }

    private OrderItemDTO convertItemToDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductImageUrl(item.getProduct().getImageUrl());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setGstPercentage(item.getGstPercentage());
        dto.setSubtotal(item.getSubtotal());
        dto.setTaxAmount(item.getTaxAmount());
        dto.setTotal(item.getTotal());
        return dto;
    }

    private ClientDTO convertClientToDTO(Client client) {
        return new ClientDTO(
                client.getId(),
                client.getCompany(),
                client.getContactPerson(),
                client.getPhone(),
                client.getEmail(),
                client.getGstNumber(),
                client.getAddress(),
                client.getActive(),
                client.getCreatedBy(),
                client.getUsername(),
                null);
    }
}
