
# Product Service (Microservice)

## 📌 Description

Le microservice **Product** gère tout ce qui concerne les produits dans notre architecture microservices.
Il expose des endpoints CRUD sécurisés via **Spring Boot** et **Spring Data JPA**, avec authentification et autorisation via **Keycloak**.
Il communique avec l’API Gateway pour la sécurisation et est prêt pour l’intégration frontend.

---

## ⚙️ Stack technique

* **Spring Boot 3**
* **Spring Data JPA**
* **PostgreSQL** / H2 (pour tests)
* **Spring Security OAuth2 Resource Server** (JWT / Keycloak)
* **Java 17+**
* **Maven**

---

## 🏗️ Structure du projet

```
product-service/
├─ src/main/java/org/example/productservice/
│   ├─ controllers/       # Endpoints REST
│   ├─ models/            # Entités JPA
│   ├─ repositories/      # Interfaces Spring Data JPA
│   ├─ services/          # Logique métier
│   └─ ProductServiceApplication.java
├─ src/main/resources/
│   ├─ application.yml    # Configuration DB & Keycloak
├─ pom.xml
```

---

## 🔑 Sécurité

* **JWT obligatoire** pour tous les endpoints
* **Rôles** gérés via Keycloak :

    * `ADMIN` → CRUD complet
    * `CLIENT` → Lecture seulement
* **Endpoints sécurisés** via annotations `@PreAuthorize` dans les contrôleurs

Exemple :

```java
@GetMapping("/{id}")
@PreAuthorize("hasAnyRole('ADMIN','CLIENT')")
public Product getProductById(@PathVariable Long id) { ... }

@PostMapping("/")
@PreAuthorize("hasRole('ADMIN')")
public Product createProduct(@RequestBody Product product) { ... }
```

---

## 🌐 Endpoints API

| Méthode | URL                | Rôle Autorisé | Description              |
| ------- | ------------------ | ------------- | ------------------------ |
| GET     | /api/products      | ADMIN, CLIENT | Liste tous les produits  |
| GET     | /api/products/{id} | ADMIN, CLIENT | Détails produit par ID   |
| POST    | /api/products      | ADMIN         | Créer un nouveau produit |
| PUT     | /api/products/{id} | ADMIN         | Mettre à jour un produit |
| DELETE  | /api/products/{id} | ADMIN         | Supprimer un produit     |

> ⚠️ Les requêtes non autorisées retournent `401` ou `403`.

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
    url: jdbc:postgresql://localhost:5432/productdb
    username: postgres
    password: password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

* Pour tests rapides, tu peux utiliser **H2** :

```yaml
spring.datasource.url=jdbc:h2:mem:productdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

---

## 🚀 Démarrage rapide

1. Lancer H2 en mémoire pour tests
2. Lancer **Keycloak** (Docker) avec realm `microservices-realm` et roles `ADMIN`/`CLIENT`
3. Configurer `application.yml` avec les paramètres DB et Keycloak
4. Lancer le microservice :

5. Tester les endpoints avec **Postman** ou via **API Gateway** si déjà configurée

---

## 🔄 Intégration avec le frontend

* Le frontend React récupère les produits via **API Gateway** :

```
GET /api/products
Authorization: Bearer <JWT>
```

* Les rôles sont propagés automatiquement via Keycloak

---

## ✅ Checklist

Avant de commencer l’intégration frontend, vérifier :

* [ ] Microservice Product démarre correctement
* [ ] Endpoints sécurisés (`401` si pas de token, `403` si rôle insuffisant)
* [ ] Test POST / PUT / DELETE fonctionne pour ADMIN
* [ ] GET accessible pour CLIENT

---

