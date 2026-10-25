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

            // Price typed by the user while billing wins; otherwise use the product price (or 0 if none)
            BigDecimal unitPrice = (lineItemDTO.getUnitPrice() != null && lineItemDTO.getUnitPrice().signum() >= 0)
                ? lineItemDTO.getUnitPrice()
                : (product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO);
            BigDecimal gstPct = product.getGst() != null ? product.getGst() : BigDecimal.ZERO;
            BigDecimal itemSubtotal = unitPrice.multiply(quantity);
            BigDecimal discountAmount = itemSubtotal.multiply(discountPct)
                .divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
            BigDecimal taxableAmount = itemSubtotal.subtract(discountAmount);
            BigDecimal itemTax = taxableAmount.multiply(gstPct)
                .divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
            BigDecimal itemTotal = taxableAmount.add(itemTax);

            InvoiceLineItem lineItem = InvoiceLineItem.builder()
                .invoice(invoice)
                .product(product)
                .quantity(lineItemDTO.getQuantity())
                .unitPrice(unitPrice)
                .gstPercentage(gstPct)
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
        // keep the received amount in step with a manual status change
        if (status == InvoiceStatus.PAID) {
            invoice.setPaidAmount(invoice.getGrandTotal());
        } else if (status == InvoiceStatus.PENDING && invoice.getPaidAmount() != null
                && invoice.getPaidAmount().compareTo(invoice.getGrandTotal()) >= 0) {
            invoice.setPaidAmount(BigDecimal.ZERO);
        }
        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return convertToDTO(updatedInvoice);
    }

    /** Record how much money has been received so far (part payment). Status follows automatically. */
    public InvoiceDTO recordPayment(Long id, BigDecimal paidAmount) {
        Invoice invoice = invoiceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invoice not found"));
        if (paidAmount == null || paidAmount.signum() < 0) {
            throw new RuntimeException("Paid amount cannot be negative");
        }
        if (paidAmount.compareTo(invoice.getGrandTotal()) > 0) {
            throw new RuntimeException("Paid amount cannot be more than the invoice total");
        }
        invoice.setPaidAmount(paidAmount);
        if (paidAmount.compareTo(invoice.getGrandTotal()) >= 0) {
            invoice.setStatus(InvoiceStatus.PAID);
        } else if (invoice.getStatus() == InvoiceStatus.PAID) {
            invoice.setStatus(InvoiceStatus.PENDING); // balance still due
        }
        return convertToDTO(invoiceRepository.save(invoice));
    }

    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }

    public void sendInvoiceByEmail(Long id, String recipientEmail) {
        Invoice invoice = invoiceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invoice not found"));

        try {
            BigDecimal total = invoice.getGrandTotal();
            BigDecimal paid = invoice.getStatus() == InvoiceStatus.PAID
                ? total
                : (invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO);
            BigDecimal balance = total.subtract(paid).max(BigDecimal.ZERO);
            boolean cancelled = invoice.getStatus() == InvoiceStatus.CANCELLED;
            boolean fullyPaid = !cancelled && (invoice.getStatus() == InvoiceStatus.PAID || balance.signum() == 0);
            boolean partial = !cancelled && !fullyPaid && paid.signum() > 0;

            String statusLabel = cancelled ? "CANCELLED"
                : fullyPaid ? "PAID"
                : partial ? "PARTIALLY PAID"
                : invoice.getStatus() == InvoiceStatus.OVERDUE ? "OVERDUE" : "PENDING";

            StringBuilder sb = new StringBuilder();
            sb.append("Dear ").append(invoice.getClient().getContactPerson()).append(",\n\n");
            if (fullyPaid) {
                sb.append("Thank you! We have received full payment for invoice ")
                  .append(invoice.getInvoiceNumber()).append(".\n\n");
            } else if (cancelled) {
                sb.append("Invoice ").append(invoice.getInvoiceNumber()).append(" has been cancelled.\n\n");
            } else if (partial) {
                sb.append("Thank you for your part payment. Here is the current status of invoice ")
                  .append(invoice.getInvoiceNumber()).append(".\n\n");
            } else {
                sb.append("Please find below your invoice ").append(invoice.getInvoiceNumber()).append(".\n\n");
            }
            sb.append("Status: ").append(statusLabel).append("\n");
            sb.append("Invoice Total: Rs ").append(total).append("\n");
            if (!cancelled) {
                sb.append("Amount Paid: Rs ").append(paid).append("\n");
                sb.append("Balance Due: Rs ").append(balance).append("\n");
            }
            if (!fullyPaid && !cancelled) {
                sb.append("Due Date: ").append(invoice.getDueDate()).append("\n");
            }
            sb.append("\nThank you for your business!\n\nJainam Billing System");
            String textBody = sb.toString();

            String htmlBody = textBody.replace("\n", "<br/>");

            Map<String, Object> sender = new HashMap<>();
            sender.put("name", brevoSenderName);
            sender.put("email", brevoSenderEmail);

            Map<String, Object> recipient = new HashMap<>();
            recipient.put("email", recipientEmail);

            Map<String, Object> body = new HashMap<>();
            body.put("sender", sender);
            body.put("to", List.of(recipient));
            body.put("subject", "Invoice " + invoice.getInvoiceNumber() + " - " + statusLabel);
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
        long next = invoiceRepository.findMaxInvoiceSequence() + 1;
        String number = String.format("INV-%05d", next);
        // extra safety: never return a number that already exists
        while (invoiceRepository.existsByInvoiceNumber(number)) {
            next++;
            number = String.format("INV-%05d", next);
        }
        return number;
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
        // invoices marked PAID before part-payments existed have no paid_amount: treat them as fully paid
        dto.setPaidAmount(invoice.getStatus() == InvoiceStatus.PAID
            ? invoice.getGrandTotal()
            : (invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO));
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
            client.getActive(),
            client.getCreatedBy(),
            client.getUsername(),
            null
        );
    }

    private InvoiceLineItemDTO convertLineItemToDTO(InvoiceLineItem lineItem) {
        Product product = lineItem.getProduct();
        return new InvoiceLineItemDTO(
            lineItem.getId(),
            product == null ? null : product.getId(),
            product == null ? "Deleted product" : product.getName(),
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
