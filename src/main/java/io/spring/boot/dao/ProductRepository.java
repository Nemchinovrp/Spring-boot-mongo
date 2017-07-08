package io.spring.boot.dao;

import io.spring.boot.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {
    public Product findByName(String name);
}
