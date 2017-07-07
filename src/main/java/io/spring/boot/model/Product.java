package io.spring.boot.model;

import lombok.Data;

import javax.persistence.Entity;
@Data
@Entity
public class Product {
    private int id;
    private String name;
    public Product(){}

    public Product(int id, String name) {
        this.id = id;
        this.name = name;
    }
}
