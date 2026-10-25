package com.jainam.service;

import com.jainam.dto.ProductDTO;
import com.jainam.entity.Product;
import com.jainam.entity.Category;
import com.jainam.repository.CategoryRepository;
import com.jainam.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.Locale;
import java.util.HashSet;
import java.util.Set;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductCatalogParser catalogParser;

    /** Reads a catalogue PDF and returns the products found (NOT saved yet, used for preview). */
    public List<ProductDTO> previewCatalogue(byte[] pdfBytes) throws java.io.IOException {
        return catalogParser.parse(pdfBytes);
    }

    /** Saves all reviewed products from the catalogue preview in one go. */
    public Map<String, Integer> importProducts(List<ProductDTO> products) {
        int skipped = 0;
        int failed = 0;
        List<Product> toSave = new ArrayList<>();
        Set<String> seen = new HashSet<>();
        for (Product existing : productRepository.findAll()) {
            seen.add(duplicateKey(existing.getProductCode() == null ? existing.getName() : existing.getProductCode(), existing.getSize()));
        }
        for (ProductDTO dto : products) {
            if (dto == null || isBlank(dto.getName()) || !Boolean.TRUE.equals(dto.getReviewConfirmed())) { failed++; continue; }
            String key = duplicateKey(dto.getProductCode() == null ? dto.getName() : dto.getProductCode(), dto.getSize());
            if (!seen.add(key)) { skipped++; continue; }

            try {
                dto.setPrice(null); // Catalogue preview never imports a price.
                String category = dto.getCategory() == null ? null : dto.getCategory().trim();
                if (category != null && !category.isEmpty() && !categoryRepository.existsByName(category)) {
                    categoryRepository.save(Category.builder().name(category).build());
                }
                toSave.add(convertToEntity(dto));
            } catch (RuntimeException e) {
                failed++;
            }
        }
        int saved = 0;
        if (!toSave.isEmpty()) {
            try {
                productRepository.saveAll(toSave);
                saved = toSave.size();
            } catch (RuntimeException e) {
                // Repository saveAll is one transaction: report the whole rejected batch as failed.
                failed += toSave.size();
            }
        }
        return Map.of("saved", saved, "skipped", skipped, "failed", failed);
    }

    private String duplicateKey(String name, String size) {
        return (name == null ? "" : name.trim().replaceAll("\\s+", " ").toLowerCase(Locale.ROOT))
                + "|" + (size == null ? "" : size.trim().replaceAll("\\s+", " ").toLowerCase(Locale.ROOT));
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

  public List<ProductDTO> getAllProducts() {
    return productRepository.findAll().stream()
        .filter(p -> Boolean.TRUE.equals(p.getActive()))
        .sorted((a, b) -> b.getId().compareTo(a.getId())) // newest (highest id) first  ← new line
        .map(this::convertToDTO)
        .collect(Collectors.toList());
}
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDTO(product);
    }

    public List<ProductDTO> searchProducts(String keyword) {
        return productRepository.searchProducts(keyword).stream()
            .filter(p -> Boolean.TRUE.equals(p.getActive()))
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = convertToEntity(productDTO);
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(productDTO.getName());
        product.setProductCode(productDTO.getProductCode());
        product.setDescription(productDTO.getDescription());
        product.setCategory(productDTO.getCategory());
        product.setBrand(productDTO.getBrand());
        product.setSize(productDTO.getSize());
        product.setPrice(productDTO.getPrice());
        product.setGst(productDTO.getGst());
        product.setStock(productDTO.getStock());
        product.setImageUrl(productDTO.getImageUrl());

        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setActive(false);
        productRepository.save(product);
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setProductCode(product.getProductCode());
        dto.setDescription(product.getDescription());
        dto.setCategory(product.getCategory());
        dto.setBrand(product.getBrand());
        dto.setSize(product.getSize());
        dto.setPrice(product.getPrice());
        dto.setGst(product.getGst());
        dto.setStock(product.getStock());
        dto.setImageUrl(product.getImageUrl());
        dto.setActive(product.getActive());
        return dto;
    }

    private Product convertToEntity(ProductDTO productDTO) {
        return Product.builder()
            .name(productDTO.getName())
            .productCode(productDTO.getProductCode())
            .description(productDTO.getDescription())
            .category(productDTO.getCategory())
            .brand(productDTO.getBrand())
            .size(productDTO.getSize())
            .price(productDTO.getPrice())
            .gst(productDTO.getGst())
            .stock(productDTO.getStock())
            .imageUrl(productDTO.getImageUrl())
            .active(true)
            .build();
    }
}
