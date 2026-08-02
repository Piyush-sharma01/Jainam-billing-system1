package com.jainam.repository;

import com.jainam.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', ?1, '%')) OR LOWER(p.category) LIKE LOWER(CONCAT('%', ?1, '%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Product> searchProducts(String keyword);
}
