# Microservices Security Project

Ce projet est une application basée sur une architecture microservices, conçue avec une approche DevSecOps, mettant l'accent sur la sécurité, l'observabilité et une expérience utilisateur moderne.

## Aperçu

| Tableau de bord Grafana | Workflow CI/CD | Page des produits |
| :---: | :---: | :---: |
| ![Tableau de bord Grafana](docs/grafana_dashboard_with_4_viz_frontend_backend_orderservice_productservice.png) | ![Workflow CI/CD](docs/cicd_workflow_succedeed_in_github_actions.png) | ![Page des Produits](docs/frontend_client_products_page.png) |

## Vue d'ensemble de l'Architecture

Le projet se compose de trois couches principales :

1.  **Backend (Java/Spring Boot)**: Fournit les services métier via une architecture microservices, sécurisée par des tokens JWT.
2.  **Frontend (React/TypeScript)**: Une application web moderne offrant une interface utilisateur interactive et authentifiée.
3.  **DevSecOps (Docker, Keycloak, Grafana, Loki)**: Gère l'orchestration des services, l'identité et l'accès, ainsi que le monitoring et la journalisation.

## Composants du Projet

### 1. Backend

Le backend est développé en Java avec Spring Boot et est structuré en plusieurs microservices :

-   **Gateway**: Point d'entrée unique, gère le routage et la sécurité périmétrique.
-   **Product Service**: Gère les opérations liées aux produits.
-   **Order Service**: Gère les opérations liées aux commandes.

Chaque microservice est sécurisé par Spring Security et utilise des tokens JWT pour l'authentification et l'autorisation. La persistance des données est gérée par Spring Data JPA avec une base de données PostgreSQL dédiée par service.

Pour plus de détails, consultez le [README du Backend](backend/README.md).

### 2. Frontend

Le frontend est une application web construite avec React et TypeScript, utilisant Vite pour le bundling et Tailwind CSS pour le stylisme.

-   **Interface Utilisateur**: Offre une navigation intuitive à travers les pages de produits, de commandes et de profil.
-   **Authentification**: S'intègre avec Keycloak via l'adaptateur `keycloak-js` pour gérer l'authentification des utilisateurs et l'accès aux routes protégées.
-   **Communication API**: Utilise Axios pour interagir avec les microservices backend.

Pour plus de détails, consultez le [README du Frontend](frontend/README.md).

### 3. DevSecOps

Le répertoire `devsecops` contient tous les outils et configurations nécessaires pour le développement, le déploiement, la sécurité et la supervision de l'application :

-   **Containerisation**: Utilisation de Docker et Docker Compose pour orchestrer l'ensemble des services.
-   **Gestion d'Identité et d'Accès (IAM)**: Keycloak est déployé pour fournir l'authentification unique (SSO) et la gestion des utilisateurs, des rôles et des autorisations.
-   **Observabilité**: Une stack de monitoring composée de Grafana pour la visualisation, Loki pour l'agrégation de logs, et Promtail pour le shipping des logs des conteneurs.
-   **Intégration et Déploiement Continus (CI/CD)**: Des pipelines GitHub Actions (`.github/workflows/ci-cd.yml`) sont configurés pour automatiser le build, les tests et le déploiement des applications.

Pour plus de détails, consultez le [README de DevSecOps](devsecops/README.md).

## Démarrage Rapide

Pour démarrer le projet localement, assurez-vous d'avoir Docker et Docker Compose installés.

1.  **Cloner le dépôt**:
    ```bash
    git clone https://github.com/votre-utilisateur/microservices-security-project.git
    cd microservices-security-project
    ```
2.  **Lancer l'infrastructure DevSecOps**:
    Naviguez vers le répertoire `devsecops` et démarrez les services avec Docker Compose (Keycloak, Grafana, Loki, etc.):
    ```bash
    cd devsecops
    docker-compose -f docker-compose.dev.yml up --build -d
    ```
    Une fois les conteneurs démarrés, vous devriez voir un résultat similaire à celui-ci avec `docker ps`:
    ![Résultat de la commande docker ps](docs/docker_ps_command_result.png)

3.  **Lancer le Backend**:
    Pour chaque microservice dans `backend/`, vous pouvez le construire et le démarrer:
    ```bash
    # Exemple pour le gateway
    cd backend/gateway
    ./mvnw spring-boot:run
    ```
    Répétez pour `product-service` et `order-service`.

4.  **Lancer le Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

Accédez à l'application frontend via l'URL configurée (généralement `http://localhost:5173` ou similaire, selon votre configuration Vite).

## Environnements

- **Développement**: Utilisez les configurations `.dev.yml` pour le développement local.
- **Production/Staging**: Le `docker-compose.yml` principal et le pipeline CI/CD sont conçus pour les environnements de production ou de staging.
