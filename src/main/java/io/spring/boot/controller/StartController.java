package io.spring.boot.controller;

import io.spring.boot.dao.ProductRepository;
import io.spring.boot.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
public class StartController {
    @Autowired
    private ProductRepository productRepository;
    @RequestMapping("/")
    public String login(){
       /* Product product = new Product("2","soup");
        productRepository.save(product);
        System.out.println("save product");
        System.out.println(productRepository.count());
        List<Product> productlist = productRepository.findAll();
        for(Product temp : productlist){
            System.out.println(temp);
        }*/
        System.out.println(productRepository.findByName("soup"));
        return "login";
    }
}
