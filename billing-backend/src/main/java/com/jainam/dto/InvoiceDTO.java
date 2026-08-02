package com.jainam.dto;

import com.jainam.entity.Invoice.InvoiceStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDTO {
    private Long id;
    private String invoiceNumber;
    private ClientDTO client;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private List<InvoiceLineItemDTO> lineItems = new ArrayList<>();
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal grandTotal;
    private InvoiceStatus status;
    private String notes;
}
