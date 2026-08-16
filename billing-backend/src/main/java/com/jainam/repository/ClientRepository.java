package com.jainam.repository;

import com.jainam.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    @Query("SELECT c FROM Client c WHERE LOWER(c.company) LIKE LOWER(CONCAT('%', ?1, '%')) OR LOWER(c.contactPerson) LIKE LOWER(CONCAT('%', ?1, '%')) OR LOWER(c.email) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Client> searchClients(String keyword);

    List<Client> findByActiveTrue();

    List<Client> findByActiveTrueAndCreatedBy(String createdBy);
}
