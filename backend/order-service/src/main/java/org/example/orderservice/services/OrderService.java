package org.example.orderservice.services;

import lombok.RequiredArgsConstructor;
import org.example.orderservice.dto.ProductResponse;
import org.example.orderservice.entities.Order;
import org.example.orderservice.entities.OrderItem;
import org.example.orderservice.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final WebClient webClient;

    @Value("${external.product-service-url}")
    private String productServiceUrl;

    /**
     * 🔐 Appel sécurisé inter-service vers product-service
     * Le JWT utilisateur est automatiquement propagé
     */
    public Integer getProductStock(Long productId) {

        ProductResponse product = webClient.get()
                .uri(productServiceUrl + "/products/{id}", productId)
                .retrieve()
                .bodyToMono(ProductResponse.class)
                .block();

        if (product == null) {
            throw new RuntimeException("Produit introuvable (id=" + productId + ")");
        }

        return product.getQuantity();
    }

    /**
     * Création d'une commande pour un utilisateur
     */
    public Order createOrder(Order order, String username) {

        order.setOrderDate(LocalDateTime.now());
        order.setUsername(username);
        order.setStatus("CREATED");

        double total = 0.0;

        for (OrderItem item : order.getItems()) {

            // Vérification du stock via product-service (JWT propagé)
            Integer stock = getProductStock(item.getProductId());

            if (stock == null || stock < item.getQuantity()) {
                throw new RuntimeException(
                        "Stock insuffisant pour le produit " + item.getProductId()
                );
            }

            total += item.getPrice() * item.getQuantity();
        }

        order.setTotalAmount(total);

        return orderRepository.save(order);
    }

    /**
     * Récupère toutes les commandes (ADMIN)
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /**
     * Récupère une commande par id (ADMIN)
     */
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    /**
     * Récupère toutes les commandes pour un utilisateur donné
     */
    public List<Order> getOrdersByUser(String username) {
        return orderRepository.findByUsername(username);
    }

    /**
     * Récupère une commande par id et vérifie qu'elle appartient à l'utilisateur
     */
    public Order getOrderByIdForUser(Long id, String username) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUsername().equals(username)) {
            throw new RuntimeException(
                    "Accès refusé : cette commande n'appartient pas à l'utilisateur"
            );
        }

        return order;
    }
}
