package io.spring.boot.controller;

import io.spring.boot.dao.PriceRepository;
import io.spring.boot.model.Price;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
public class StartController {
    @Autowired
    private PriceRepository priceDao;

    @RequestMapping("/")
    public String startPage(){
        System.out.println(priceDao.count());
        System.out.println(priceDao.exists(1));
        return "login";
    }

    @RequestMapping("/hello")
    public String helloPage(){
        List<Price> prices = (List<Price>) priceDao.findAll();
        for(Price temp : prices){
            System.out.println(temp);
        }
        return "hello";
    }

    @RequestMapping("/registration")
    public String registrationPage(){
        return "registration";
    }
}