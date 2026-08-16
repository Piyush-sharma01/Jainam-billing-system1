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
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private RestTemplate restTemplate;

    @Value("${brevo.api-key}")
    private String brevoApiKey;

    @Value("${brevo.sender-email}")
    private String brevoSenderEmail;

    @Value("${brevo.sender-name}")
    private String brevoSenderName;

    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    public List<InvoiceDTO> getVisibleInvoices(String role, String username) {
        List<Invoice> invoices;
        if ("MARKETING".equalsIgnoreCase(role) && username != null) {
            invoices = invoiceRepository.findByCreatedByOrderByInvoiceDateDesc(username);
        } else {
            invoices = invoiceRepository.findAllByOrderByInvoiceDateDesc();
        }
        return invoices.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public InvoiceDTO getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invoice not found"));
        return convertToDTO(invoice);
    }

    public List<InvoiceDTO> getInvoicesByStatus(InvoiceStatus status, String role, String username) {
        List<Invoice> invoices;
        if ("MARKETING".equalsIgnoreCase(role) && username != null) {
            invoices = invoiceRepository.findByStatusAndCreatedByOrderByInvoiceDateDesc(status, username);
        } else {
            invoices = invoiceRepository.findByStatusOrderByInvoiceDateDesc(status);
        }
        return invoices.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO, String role, String username) {
        Client client = clientRepository.findById(invoiceDTO.getClient().getId())
            .orElseThrow(() -> new RuntimeException("Client not found"));

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setClient(client);
        invoice.setInvoiceDate(invoiceDTO.getInvoiceDate());
        invoice.setDueDate(invoiceDTO.getDueDate());
        invoice.setNotes(invoiceDTO.getNotes());
        invoice.setStatus(InvoiceStatus.PENDING);
        invoice.setCreatedBy("MARKETING".equalsIgnoreCase(role) && username != null ? username : "owner");

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal taxAmount = BigDecimal.ZERO;

        for (InvoiceLineItemDTO lineItemDTO : invoiceDTO.getLineItems()) {
            Product product = productRepository.findById(lineItemDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

            BigDecimal quantity = new BigDecimal(lineItemDTO.getQuantity());
            BigDecimal discountPct = lineItemDTO.getDiscountPercentage() != null
                ? lineItemDTO.getDiscountPercentage()
                : BigDecimal.ZERO;

            BigDecimal itemSubtotal = product.getPrice().multiply(quantity);
            BigDecimal discountAmount = itemSubtotal.multiply(discountPct)
                .divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
            BigDecimal taxableAmount = itemSubtotal.subtract(discountAmount);
            BigDecimal itemTax = taxableAmount.multiply(product.getGst())
                .divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
            BigDecimal itemTotal = taxableAmount.add(itemTax);

            InvoiceLineItem lineItem = InvoiceLineItem.builder()
                .invoice(invoice)
                .product(product)
                .quantity(lineItemDTO.getQuantity())
                .unitPrice(product.getPrice())
                .gstPercentage(product.getGst())
                .discountPercentage(discountPct)
                .subtotal(itemSubtotal)
                .discountAmount(discountAmount)
                .taxAmount(itemTax)
                .total(itemTotal)
                .build();

            invoice.getLineItems().add(lineItem);
            subtotal = subtotal.add(taxableAmount);
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
            String textBody = "Dear " + invoice.getClient().getContactPerson() + ",\n\n" +
                "Please find below your invoice " + invoice.getInvoiceNumber() + ".\n\n" +
                "Amount Due: Rs " + invoice.getGrandTotal() + "\n" +
                "Due Date: " + invoice.getDueDate() + "\n\n" +
                "Thank you for your business!\n\n" +
                "Jainam Billing System";

            String htmlBody = textBody.replace("\n", "<br/>");

            Map<String, Object> sender = new HashMap<>();
            sender.put("name", brevoSenderName);
            sender.put("email", brevoSenderEmail);

            Map<String, Object> recipient = new HashMap<>();
            recipient.put("email", recipientEmail);

            Map<String, Object> body = new HashMap<>();
            body.put("sender", sender);
            body.put("to", List.of(recipient));
            body.put("subject", "Invoice " + invoice.getInvoiceNumber());
            body.put("htmlContent", htmlBody);
            body.put("textContent", textBody);

            HttpHeaders headers = new HttpHeaders();
            headers.set("api-key", brevoApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("accept", "application/json");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            restTemplate.postForEntity(BREVO_API_URL, request, String.class);
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
        dto.setCreatedBy(invoice.getCreatedBy());

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
            lineItem.getDiscountPercentage(),
            lineItem.getSubtotal(),
            lineItem.getDiscountAmount(),
            lineItem.getTaxAmount(),
            lineItem.getTotal()
        );
    }
}
