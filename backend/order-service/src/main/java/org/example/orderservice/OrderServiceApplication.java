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
    public class DataInitializer {

        @Bean
        CommandLineRunner initOrders(OrderRepository orderRepository) {
            return args -> {

                for (int i = 1; i <= 10; i++) {
                    Order order = Order.builder()
                            .orderDate(LocalDateTime.now())
                            .status("CREATED")
                            .username("client" + (i % 3 + 1))
                            .items(List.of(
                                    OrderItem.builder()
                                            .productId((long) i)
                                            .quantity(1 + i % 3)
                                            .price(10.0 + i)
                                            .build(),
                                    OrderItem.builder()
                                            .productId((long) (i + 10))
                                            .quantity(2)
                                            .price(5.0 + i)
                                            .build()
                            ))
                            .totalAmount(0.0)
                            .build();

                    double total = order.getItems().stream()
                            .mapToDouble(item -> item.getPrice() * item.getQuantity())
                            .sum();
                    order.setTotalAmount(total);

                    orderRepository.save(order);
                }

                System.out.println("10 commandes de test créées !");
            };
        }
    }

}
