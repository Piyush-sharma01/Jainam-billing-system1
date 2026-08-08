package com.jainam.service;

import com.jainam.dto.BrandDTO;
import com.jainam.entity.Brand;
import com.jainam.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandService {
    @Autowired
    private BrandRepository brandRepository;

    public List<BrandDTO> getAllBrands() {
        return brandRepository.findAllByOrderByNameAsc().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public BrandDTO createBrand(BrandDTO brandDTO) {
        if (brandRepository.existsByName(brandDTO.getName())) {
            throw new RuntimeException("A brand with this name already exists");
        }
        Brand brand = Brand.builder()
            .name(brandDTO.getName())
            .logoUrl(brandDTO.getLogoUrl())
            .build();
        Brand saved = brandRepository.save(brand);
        return convertToDTO(saved);
    }

    private BrandDTO convertToDTO(Brand brand) {
        return new BrandDTO(brand.getId(), brand.getName(), brand.getLogoUrl());
    }
}
