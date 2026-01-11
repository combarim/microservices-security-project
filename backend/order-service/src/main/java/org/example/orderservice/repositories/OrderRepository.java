package org.example.orderservice.repositories;

import org.example.orderservice.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUsername(String username); // <-- fonctionne maintenant car Order a un champ username
}
