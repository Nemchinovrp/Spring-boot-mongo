package io.spring.boot.dao;

import io.spring.boot.model.Price;
import org.springframework.data.repository.CrudRepository;

public interface PriceRepository extends CrudRepository<Price, Integer> {

}
