package org.example.orderservice.web;

import lombok.RequiredArgsConstructor;
import org.example.orderservice.entities.Order;
import org.example.orderservice.services.OrderService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @PreAuthorize("hasRole('CLIENT')")
    public List<Order> getAllOrdersForUser(Authentication auth) {
        String username = auth.getName();
        return orderService.getOrdersByUser(username);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public Order getOrderById(@PathVariable Long id, Authentication auth) {
        String username = auth.getName();
        return orderService.getOrderByIdForUser(id, username);
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public Order createOrder(@RequestBody Order order, Authentication auth) {
        String username = auth.getName();
        return orderService.createOrder(order, username);
    }
}
