# Order Service (Microservice)

## 📌 Description

Le microservice **Order** gère les commandes des clients dans notre architecture microservices.
Il expose des endpoints CRUD pour les commandes et est sécurisé via **Spring Boot**, **Spring Data JPA** et **Keycloak**.
Il communique avec le microservice **Product** pour vérifier les stocks et calculer le montant total des commandes.

---

## ⚙️ Stack technique

* **Spring Boot 3**
* **Spring Data JPA**
* **PostgreSQL** / H2 (pour tests)
* **Spring Security OAuth2 Resource Server** (JWT / Keycloak)
* **WebClient** pour appel inter-service Product
* **Java 17+**
* **Maven**

---

## 🏗️ Structure du projet

```
order-service/
├─ src/main/java/org/example/orderservice/
│   ├─ controllers/       # Endpoints REST
│   ├─ models/            # Entités JPA (Order, OrderItem)
│   ├─ repositories/      # Interfaces Spring Data JPA
│   ├─ services/          # Logique métier (création commande, calcul total)
│   └─ OrderServiceApplication.java
├─ src/main/resources/
│   ├─ application.yml    # Configuration DB & Keycloak
├─ pom.xml
```

---

## 🔑 Sécurité

* **JWT obligatoire** pour tous les endpoints
* **Rôles** gérés via Keycloak :

    * `ADMIN` → Liste et gestion de toutes les commandes
    * `CLIENT` → Création et consultation de ses commandes
* **Propagation du JWT** lors des appels au microservice Product pour vérifier le stock

Exemple :

```java
@PostMapping("/")
@PreAuthorize("hasRole('CLIENT')")
public Order createOrder(@RequestBody OrderRequest request) {
    return orderService.createOrder(request);
}

@GetMapping("/my")
@PreAuthorize("hasRole('CLIENT')")
public List<Order> getMyOrders(@AuthenticationPrincipal Jwt jwt) {
    return orderService.getOrdersForUser(jwt.getClaimAsString("preferred_username"));
}

@GetMapping("/")
@PreAuthorize("hasRole('ADMIN')")
public List<Order> getAllOrders() {
    return orderService.getAllOrders();
}
```

---

## 🌐 Endpoints API

| Méthode | URL              | Rôle Autorisé | Description                                               |
| ------- | ---------------- | ------------- | --------------------------------------------------------- |
| POST    | /api/orders      | CLIENT        | Créer une nouvelle commande                               |
| GET     | /api/orders/my   | CLIENT        | Liste des commandes de l’utilisateur                      |
| GET     | /api/orders      | ADMIN         | Liste toutes les commandes                                |
| GET     | /api/orders/{id} | ADMIN, CLIENT | Détails d’une commande (CLIENT = ses commandes seulement) |

> ⚠️ Les requêtes non autorisées retournent `401` ou `403`.
> ⚠️ Les commandes ne peuvent pas être créées si le produit est hors stock (`409 Conflict`).

---

## 🛠️ Configuration

### Keycloak

* Realm : `microservices-realm`
* Client : `frontend-react`
* Roles : `ADMIN`, `CLIENT`
* Exemple d’utilisateur :

    * admin1 / admin123 → ADMIN
    * client1 / client123 → CLIENT

### Base de données

* Configure `application.yml` :

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/orderdb
    username: postgres
    password: password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

* Pour tests rapides, tu peux utiliser **H2** :

```yaml
spring.datasource.url=jdbc:h2:mem:orderdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

---

## 🔄 Appel inter-service Product

Le microservice Order utilise **WebClient** pour interroger Product et vérifier :

* Disponibilité du produit
* Calcul du prix total

Exemple :

```java
@Autowired
private WebClient webClient;

Product product = webClient.get()
    .uri("http://product-service/api/products/{id}", productId)
    .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
    .retrieve()
    .bodyToMono(Product.class)
    .block();
```

---

## 🚀 Démarrage rapide

1. Lancer H2 pour tests
2. Lancer **Keycloak** (Docker) avec realm `microservices-realm` et roles `ADMIN`/`CLIENT`
3. Configurer `application.yml` avec les paramètres DB et Keycloak
4. Lancer le microservice :

5. Tester les endpoints avec **Postman** ou via **API Gateway**

---

## ✅ Checklist

Avant l’intégration frontend, vérifier :

* [ ] Microservice Order démarre correctement
* [ ] Endpoints sécurisés (`401` si pas de token, `403` si rôle insuffisant)
* [ ] Création commande pour CLIENT fonctionne
* [ ] Lecture des commandes par ADMIN et CLIENT fonctionne
* [ ] Gestion des produits hors stock renvoie bien `409`
* [ ] JWT correctement propagé vers Product Service

