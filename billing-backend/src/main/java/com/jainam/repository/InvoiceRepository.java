package com.jainam.repository;

import com.jainam.entity.Invoice;
import com.jainam.entity.Invoice.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByStatusOrderByInvoiceDateDesc(InvoiceStatus status);
    List<Invoice> findAllByOrderByInvoiceDateDesc();

boolean existsByClientId(Long clientId);
}