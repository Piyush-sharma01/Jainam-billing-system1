package com.jainam.repository;

import com.jainam.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    List<Brand> findAllByOrderByNameAsc();
    Optional<Brand> findByName(String name);
    boolean existsByName(String name);
}
