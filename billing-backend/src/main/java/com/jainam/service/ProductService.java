package com.jainam.service;

import com.jainam.dto.ProductDTO;
import com.jainam.entity.Product;
import com.jainam.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
            .filter(p -> Boolean.TRUE.equals(p.getActive()))
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
