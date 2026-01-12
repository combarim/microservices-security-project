
# API Gateway Service

## 📌 Description

Ce microservice **Spring Cloud Gateway** sert de point d’entrée unique pour tous les autres microservices.
Il gère :

* La **redirection des requêtes** vers les microservices (`product-service`, `order-service`, etc.)
* La **sécurité JWT** pour authentifier les utilisateurs via Keycloak
* La **vérification des rôles** pour autoriser l’accès aux endpoints

---

## 🚀 Lancer le Gateway

### 1. Configurer Keycloak

Avant de lancer le Gateway, assure-toi que Keycloak est démarré et que le realm `microservices-realm` et le client `frontend-react` sont configurés.
Le Gateway utilise Keycloak pour valider les tokens JWT.

### 2. Configurer le `application.yml`

Voici un exemple minimal pour ton Gateway :

```yaml
server:server:
  port: 8888

spring:
  application:
    name: gateway

  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8081/realms/microservices-realm

  cloud:
    gateway:
      server:
        webflux:
          routes:

            - id: product-service
              uri: http://localhost:8082
              predicates:
                - Path=/products/**

            - id: order-service
              uri: http://localhost:8083
              predicates:
                - Path=/orders/**
```

* `issuer-uri` → URL du realm Keycloak pour vérifier les tokens JWT
* `uri` → URL locale de chaque microservice

### 3. Lancer le Gateway


Le Gateway sera disponible sur `http://localhost:8888/`.

---

## 🔐 Sécurité

### Exemple d’accès selon rôle

| Endpoint           | GET          | POST/PUT/DELETE |
| ------------------ | ------------ | --------------- |
| `/api/products/**` | ADMIN/CLIENT | ADMIN           |
| `/api/orders/**`   | ADMIN        | CLIENT          |

### Vérification JWT

* Le Gateway vérifie que le token JWT est valide pour tous les endpoints
* Les microservices peuvent effectuer une double vérification pour plus de sécurité

---

## 🧪 Vérification rapide

1. Accès sans token → **401 Unauthorized**
2. Accès avec token invalide → **401 Unauthorized**
3. Accès avec token valide :

    * Rôle CLIENT tente POST sur produit → **403 Forbidden**
    * Rôle ADMIN POST produit → ✅
    * Rôle CLIENT POST commande → ✅
    * Rôle ADMIN GET commandes → ✅

---

## ⚡ Notes

* Ne contient **aucune logique métier** : uniquement routage et sécurité
* Les microservices doivent être lancés avant le Gateway pour que les routes fonctionnent
* Peut être étendu pour ajouter des **filtres**, **circuit breakers**, ou **logging global**

