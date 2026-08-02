package com.jainam.controller;

import com.jainam.dto.InvoiceDTO;
import com.jainam.entity.Invoice.InvoiceStatus;
import com.jainam.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/invoices")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class InvoiceController {
    @Autowired
    private InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<InvoiceDTO>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceDTO> getInvoiceById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<InvoiceDTO>> getInvoicesByStatus(@PathVariable InvoiceStatus status) {
        return ResponseEntity.ok(invoiceService.getInvoicesByStatus(status));
    }

    @PostMapping
    public ResponseEntity<InvoiceDTO> createInvoice(@RequestBody InvoiceDTO invoiceDTO) {
        return ResponseEntity.ok(invoiceService.createInvoice(invoiceDTO));
    }

    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<InvoiceDTO> updateInvoiceStatus(@PathVariable Long id, @PathVariable InvoiceStatus status) {
        return ResponseEntity.ok(invoiceService.updateInvoiceStatus(id, status));
    }

    @PostMapping("/{id}/send-email")
    public ResponseEntity<String> sendInvoiceByEmail(@PathVariable Long id, @RequestParam String email) {
        try {
            invoiceService.sendInvoiceByEmail(id, email);
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}
