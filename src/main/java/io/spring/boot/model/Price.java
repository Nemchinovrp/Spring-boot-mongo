package io.spring.boot.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "price")
public class Price {
    @Id
//    @GeneratedValue(strategy= GenerationType.AUTO)
    private int id;
    private int product_id;
    private int price;

    public Price() {
    }

    public Price(int id, int product_id, int price) {
        this.id = id;
        this.product_id = product_id;
        this.price = price;
    }
}