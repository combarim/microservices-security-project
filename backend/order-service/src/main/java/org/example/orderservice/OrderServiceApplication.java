package org.example.orderservice;

import lombok.RequiredArgsConstructor;
import org.example.orderservice.entities.Order;
import org.example.orderservice.entities.OrderItem;
import org.example.orderservice.repositories.OrderRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
public class OrderServiceApplication {

    public static void main(String[] args) {

        SpringApplication.run(OrderServiceApplication.class, args);
    }

    @Configuration
    @RequiredArgsConstructor
    public class DataInitializer {

        private final OrderRepository orderRepository;

        @Bean
        CommandLineRunner initOrders() {
            return args -> {

                Order order1 = Order.builder()
                        .orderDate(LocalDateTime.now().minusDays(1))
                        .status("CREATED")
                        .items(List.of(
                                OrderItem.builder()
                                        .productId(1L)
                                        .quantity(2)
                                        .price(50.00)
                                        .build(),
                                OrderItem.builder()
                                        .productId(2L)
                                        .quantity(1)
                                        .price(20.50)
                                        .build()
                        ))
                        .totalAmount(120.50)
                        .build();

                Order order2 = Order.builder()
                        .orderDate(LocalDateTime.now())
                        .status("PAID")
                        .items(List.of(
                                OrderItem.builder()
                                        .productId(3L)
                                        .quantity(3)
                                        .price(25.00)
                                        .build()
                        ))
                        .totalAmount(75.00)
                        .build();

                orderRepository.saveAll(List.of(order1, order2));
            };
        }
    }


}
