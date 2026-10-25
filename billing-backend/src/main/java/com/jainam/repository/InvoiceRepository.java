package com.jainam.repository;

import com.jainam.entity.Invoice;
import com.jainam.entity.Invoice.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByStatusOrderByInvoiceDateDesc(InvoiceStatus status);
    List<Invoice> findAllByOrderByInvoiceDateDesc();
    List<Invoice> findByCreatedByOrderByInvoiceDateDesc(String createdBy);
    List<Invoice> findByStatusAndCreatedByOrderByInvoiceDateDesc(InvoiceStatus status, String createdBy);

boolean existsByClientId(Long clientId);

    boolean existsByInvoiceNumber(String invoiceNumber);

    // Highest number used so far (INV-00005 -> 5). Safe even after invoices were deleted.
    @Query(value = "SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number, 5) AS UNSIGNED)), 0) FROM invoices WHERE invoice_number LIKE 'INV-%'", nativeQuery = true)
    long findMaxInvoiceSequence();
}
