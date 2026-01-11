package org.example.productservice;

import org.example.productservice.entities.Product;
import org.example.productservice.repositories.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ProductServiceApplication {

    public static void main(String[] args) {

        SpringApplication.run(ProductServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner start(ProductRepository productRepository) {
        return args -> {

            productRepository.save(Product.builder()
                    .name("Laptop Dell")
                    .description("Ordinateur portable Dell Core i7")
                    .price(8500)
                    .quantity(10)
                    .build());

            productRepository.save(Product.builder()
                    .name("Clavier mécanique")
                    .description("Clavier mécanique RGB pour gaming")
                    .price(650)
                    .quantity(30)
                    .build());

            productRepository.save(Product.builder()
                    .name("Souris Logitech")
                    .description("Souris sans fil ergonomique Logitech")
                    .price(350)
                    .quantity(40)
                    .build());

            productRepository.save(Product.builder()
                    .name("Écran Samsung 24\"")
                    .description("Écran Full HD 24 pouces")
                    .price(2200)
                    .quantity(15)
                    .build());

            productRepository.save(Product.builder()
                    .name("Casque Bluetooth")
                    .description("Casque audio Bluetooth avec réduction de bruit")
                    .price(900)
                    .quantity(25)
                    .build());

            productRepository.save(Product.builder()
                    .name("SSD 1To")
                    .description("Disque SSD 1To haute performance")
                    .price(1200)
                    .quantity(20)
                    .build());

            productRepository.save(Product.builder()
                    .name("RAM 16Go")
                    .description("Barrette mémoire RAM 16Go DDR4")
                    .price(800)
                    .quantity(35)
                    .build());

            productRepository.save(Product.builder()
                    .name("Imprimante HP")
                    .description("Imprimante multifonction HP")
                    .price(1800)
                    .quantity(8)
                    .build());

            productRepository.save(Product.builder()
                    .name("Webcam HD")
                    .description("Webcam HD pour visioconférence")
                    .price(500)
                    .quantity(18)
                    .build());

            productRepository.save(Product.builder()
                    .name("Station d’accueil USB-C")
                    .description("Station d’accueil USB-C multiports")
                    .price(1100)
                    .quantity(12)
                    .build());
        };
    }


}
