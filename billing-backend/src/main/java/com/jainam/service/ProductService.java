package com.jainam.service;

import com.jainam.dto.ProductDTO;
import com.jainam.entity.Product;
import com.jainam.entity.Category;
import com.jainam.repository.CategoryRepository;
import com.jainam.repository.ProductRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
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
    @Transactional
    public int importProducts(List<ProductDTO> products) {
        int saved = 0;
        for (ProductDTO dto : products) {
            boolean empty = isBlank(dto.getName()) && isBlank(dto.getCategory())
                    && dto.getPrice() == null && dto.getGst() == null && dto.getStock() == null;
            if (empty) continue;

            String category = dto.getCategory() == null ? null : dto.getCategory().trim();
            if (category != null && !category.isEmpty() && !categoryRepository.existsByName(category)) {
                categoryRepository.save(Category.builder().name(category).build());
            }
            productRepository.save(convertToEntity(dto));
            saved++;
        }
        return saved;
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
        product.setDescription(productDTO.getDescription());
        product.setCategory(productDTO.getCategory());
        product.setBrand(productDTO.getBrand());
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
        return new ProductDTO(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getCategory(),
            product.getBrand(),
            product.getPrice(),
            product.getGst(),
            product.getStock(),
            product.getImageUrl(),
            product.getActive()
        );
    }

    private Product convertToEntity(ProductDTO productDTO) {
        return Product.builder()
            .name(productDTO.getName())
            .description(productDTO.getDescription())
            .category(productDTO.getCategory())
            .brand(productDTO.getBrand())
            .price(productDTO.getPrice())
            .gst(productDTO.getGst())
            .stock(productDTO.getStock())
            .imageUrl(productDTO.getImageUrl())
            .active(true)
            .build();
    }
}
