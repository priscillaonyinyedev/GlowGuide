package com.glowguide.repository;

import com.glowguide.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductRepositoryCustom {
    Page<Product> search(ProductFilter filter, Pageable pageable);
}
