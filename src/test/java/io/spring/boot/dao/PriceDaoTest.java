package io.spring.boot.dao;

import io.spring.boot.Application;
import io.spring.boot.model.Price;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
public class PriceDaoTest {
    @Autowired
    private PriceRepository priceRepository;

    @Test
    public void testCountPrice() {
        assertEquals(2, priceRepository.count());
    }

    @Test
    public void testExistsPrice() {
        assertTrue(priceRepository.exists(1));
    }

    @Test
    public void testFindAll(){
        List<Price> prices = (List<Price>) priceRepository.findAll();
        assertEquals(2, prices.size());
    }
}
