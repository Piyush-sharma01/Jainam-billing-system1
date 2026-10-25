package com.jainam.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private String category;
    private String brand;
    private BigDecimal price;
    private BigDecimal gst;
    private Integer stock;
    private String imageUrl;
    private Boolean active;
    private String size;
    private String productCode;

    // PDF-preview evidence only; these payloads are never persisted to the products table.
    private String extractedImageData;
    private String sourceCropData;
    private String sourceLabel;
    private Integer sourcePage;
    private Boolean needsReview;
    private Boolean reviewConfirmed;
    private String reviewReason;
}
