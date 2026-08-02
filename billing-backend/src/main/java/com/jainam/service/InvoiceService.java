package com.jainam.service;

import com.jainam.dto.ClientDTO;
import com.jainam.dto.InvoiceDTO;
import com.jainam.dto.InvoiceLineItemDTO;
import com.jainam.entity.Client;
import com.jainam.entity.Invoice;
import com.jainam.entity.Invoice.InvoiceStatus;
import com.jainam.entity.InvoiceLineItem;
import com.jainam.entity.Product;
import com.jainam.repository.ClientRepository;
import com.jainam.repository.InvoiceRepository;
import com.jainam.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvoiceService {
    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private JavaMailSender mailSender;

    // Inject the configured mail username so setFrom() gets the real address
    @Value("${spring.mail.username}")
    private String mailUsername;

    public List<InvoiceDTO> getAllInvoices() {
        return invoiceRepository.findAllByOrderByInvoiceDateDesc().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public InvoiceDTO getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invoice not found"));
        return convertToDTO(invoice);
    }

    public List<InvoiceDTO> getInvoicesByStatus(InvoiceStatus status) {
        return invoiceRepository.findByStatusOrderByInvoiceDateDesc(status).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO) {
        Client client = clientRepository.findById(invoiceDTO.getClient().getId())
            .orElseThrow(() -> new RuntimeException("Client not found"));

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setClient(client);
        invoice.setInvoiceDate(invoiceDTO.getInvoiceDate());
        invoice.setDueDate(invoiceDTO.getDueDate());
        invoice.setNotes(invoiceDTO.getNotes());
        invoice.setStatus(InvoiceStatus.PENDING);

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal taxAmount = BigDecimal.ZERO;

        for (InvoiceLineItemDTO lineItemDTO : invoiceDTO.getLineItems()) {
            Product product = productRepository.findById(lineItemDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

            BigDecimal quantity = new BigDecimal(lineItemDTO.getQuantity());
            BigDecimal itemSubtotal = product.getPrice().multiply(quantity);
            BigDecimal itemTax = itemSubtotal.multiply(product.getGst()).divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
            BigDecimal itemTotal = itemSubtotal.add(itemTax);

            InvoiceLineItem lineItem = InvoiceLineItem.builder()
                .invoice(invoice)
                .product(product)
                .quantity(lineItemDTO.getQuantity())
                .unitPrice(product.getPrice())
                .gstPercentage(product.getGst())
                .subtotal(itemSubtotal)
                .taxAmount(itemTax)
                .total(itemTotal)
                .build();

            invoice.getLineItems().add(lineItem);
            subtotal = subtotal.add(itemSubtotal);
            taxAmount = taxAmount.add(itemTax);
        }

        invoice.setSubtotal(subtotal);
        invoice.setTaxAmount(taxAmount);
        invoice.setGrandTotal(subtotal.add(taxAmount));

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return convertToDTO(savedInvoice);
    }

    public InvoiceDTO updateInvoiceStatus(Long id, InvoiceStatus status) {
        Invoice invoice = invoiceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invoice not found"));
        invoice.setStatus(status);
        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return convertToDTO(updatedInvoice);
    }

    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }

    public void sendInvoiceByEmail(Long id, String recipientEmail) {
        Invoice invoice = invoiceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invoice not found"));

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            // Use injected @Value field instead of literal "${GMAIL_USER}"
            message.setFrom(mailUsername);
            message.setTo(recipientEmail);
            message.setSubject("Invoice " + invoice.getInvoiceNumber());
            message.setText("Dear " + invoice.getClient().getContactPerson() + ",\n\n" +
                "Please find attached your invoice " + invoice.getInvoiceNumber() + ".\n\n" +
                "Amount Due: ₹" + invoice.getGrandTotal() + "\n" +
                "Due Date: " + invoice.getDueDate() + "\n\n" +
                "Thank you for your business!\n\n" +
                "Jainam Billing System");

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    public String generateInvoiceNumber() {
        long count = invoiceRepository.count() + 1;
        return String.format("INV-%05d", count);
    }

    private InvoiceDTO convertToDTO(Invoice invoice) {
        InvoiceDTO dto = new InvoiceDTO();
        dto.setId(invoice.getId());
        dto.setInvoiceNumber(invoice.getInvoiceNumber());
        dto.setClient(convertClientToDTO(invoice.getClient()));
        dto.setInvoiceDate(invoice.getInvoiceDate());
        dto.setDueDate(invoice.getDueDate());
        dto.setSubtotal(invoice.getSubtotal());
        dto.setTaxAmount(invoice.getTaxAmount());
        dto.setGrandTotal(invoice.getGrandTotal());
        dto.setStatus(invoice.getStatus());
        dto.setNotes(invoice.getNotes());

        List<InvoiceLineItemDTO> lineItems = invoice.getLineItems().stream()
            .map(this::convertLineItemToDTO)
            .collect(Collectors.toList());
        dto.setLineItems(lineItems);

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
            client.getActive()
        );
    }

    private InvoiceLineItemDTO convertLineItemToDTO(InvoiceLineItem lineItem) {
        return new InvoiceLineItemDTO(
            lineItem.getId(),
            lineItem.getProduct().getId(),
            lineItem.getProduct().getName(),
            lineItem.getQuantity(),
            lineItem.getUnitPrice(),
            lineItem.getGstPercentage(),
            lineItem.getSubtotal(),
            lineItem.getTaxAmount(),
            lineItem.getTotal()
        );
    }
}
