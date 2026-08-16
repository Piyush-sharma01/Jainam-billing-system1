package com.jainam.repository;

import com.jainam.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByOrderByCreatedAtDesc();
    List<Order> findByAssignedToOrderByCreatedAtDesc(String assignedTo);
    List<Order> findByClientIdOrderByCreatedAtDesc(Long clientId);
    long countByAssignedToAndStatus(String assignedTo, Order.OrderStatus status);
    long countByStatus(Order.OrderStatus status);
}
