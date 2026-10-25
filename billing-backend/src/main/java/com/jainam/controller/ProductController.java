package com.jainam.controller;

import com.jainam.dto.ProductDTO;
import com.jainam.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<ProductDTO>> searchProducts(@PathVariable String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.createProduct(productDTO));
    }

    // Step 1: upload catalogue PDF -> returns detected products for preview (nothing saved)
    @PostMapping(value = "/import/preview", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> previewCatalogue(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please choose a PDF file");
        }
        try {
            List<ProductDTO> found = productService.previewCatalogue(file.getBytes());
            if (found.isEmpty()) {
                return ResponseEntity.badRequest().body(
                    "No products found. If this PDF is a scanned image, text cannot be read from it.");
            }
            return ResponseEntity.ok(found);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Could not read PDF: " + e.getMessage());
        }
    }

    // Step 2: save the (reviewed) products from the preview
    @PostMapping("/import/bulk")
    public ResponseEntity<Map<String, Integer>> importProducts(@RequestBody List<ProductDTO> products) {
        return ResponseEntity.ok(Map.of("saved", productService.importProducts(products)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.updateProduct(id, productDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
