# Backend

Ce répertoire contient l'architecture microservices backend du projet, développée avec Java et le framework Spring Boot.

## Architecture

Le backend est composé des microservices suivants :

- **gateway**: Une passerelle d'API construite avec Spring Cloud Gateway. Elle sert de point d'entrée unique pour toutes les requêtes frontend, gérant le routage vers les services appropriés et centralisant la sécurité.
- **product-service**: Un microservice RESTful pour la gestion du catalogue de produits.
- **order-service**: Un microservice RESTful pour la gestion des commandes des clients.

Chaque microservice est une application Spring Boot indépendante avec sa propre base de données et sa propre configuration.

## Caractéristiques Techniques

- **Langage**: Java
- **Framework**: Spring Boot, Spring Cloud (Gateway, Security), Spring Data JPA
- **Sécurité**: L'authentification et l'autorisation sont gérées via des tokens JWT.
  - La **gateway** valide les tokens JWT entrants avec le serveur Keycloak.
  - Les microservices (`product-service`, `order-service`) valident également les tokens JWT pour sécuriser leurs endpoints, en utilisant un `JwtAuthConverter` pour extraire les rôles et les permissions.
- **Communication Inter-services**: Le `order-service` communique avec le `product-service` de manière asynchrone en utilisant `WebClient`.
- **Persistance des données**: Chaque service utilise Spring Data JPA pour interagir avec sa propre base de données PostgreSQL.
- **Containerisation**: Chaque service dispose d'un `Dockerfile` pour créer une image Docker, permettant un déploiement cohérent et isolé.

## Structure

Chaque module de microservice (`gateway`, `product-service`, `order-service`) suit une structure Maven standard :

```
└── [nom-du-service]
    ├── pom.xml
    └── src
        ├── main
        │   ├── java
        │   │   └── org/example/[...]
        │   └── resources
        │       └── application.yml
        └── test
```

- `pom.xml`: Définit les dépendances spécifiques au service.
- `application.yml`: Contient la configuration du service, y compris les informations de connexion à la base de données, la configuration du serveur et l'intégration avec d'autres services comme Keycloak.
