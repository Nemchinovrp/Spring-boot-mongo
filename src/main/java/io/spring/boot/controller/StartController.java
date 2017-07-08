package io.spring.boot.controller;

import io.spring.boot.dao.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class StartController {
    @Autowired
    private ProductRepository productRepository;

    @RequestMapping("/")
    public String login() {
        System.out.println(productRepository.findByName("soup"));
        return "login";
    }
}
