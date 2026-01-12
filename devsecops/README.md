# DevSecOps

Ce répertoire regroupe les configurations et les outils pour l'orchestration, la sécurité et la supervision de l'infrastructure du projet.

## Composants Principaux

- **Keycloak**: Serveur d'authentification et d'autorisation (Identity and Access Management - IAM).
  - `realm-export.json`: Fichier d'exportation de la configuration du realm Keycloak, incluant clients, utilisateurs, rôles, etc. pour une initialisation rapide de l'environnement de sécurité.
- **Docker Compose**: Outil pour définir et exécuter des applications Docker multi-conteneurs.
  - `docker-compose.yml`: Fichier de configuration Docker Compose principal, orchestrant les services backend, frontend, Keycloak, et les outils de monitoring.
  - `docker-compose.dev.yml`: Un fichier Docker Compose dédié à l'environnement de développement, potentiellement avec des configurations spécifiques (ex: volumes pour le hot-reloading, ports exposés différemment).
- **Monitoring et Logging**:
  - **Grafana**: Plateforme d'observabilité pour visualiser les métriques et les logs.
    - `grafana-dashboards.yml`: Configuration des tableaux de bord Grafana.
    - `grafana-datasources.yml`: Configuration des sources de données pour Grafana (notamment Loki).
    - `grafana-provisioning/dashboards/dashboards.yaml`: Fichier de provisionnement pour les tableaux de bord Grafana.
    - `grafana-provisioning/datasources/loki.yaml`: Fichier de provisionnement pour la source de données Loki dans Grafana.
  - **Loki**: Système d'agrégation de logs, conçu pour stocker et interroger efficacement les logs depuis toutes les applications du stack.
    - `loki-config.yml`: Fichier de configuration de Loki.
  - **Promtail**: Agent de log shipping qui collecte les logs des conteneurs Docker et les envoie à Loki.
    - `promtail-config.yml`: Fichier de configuration de Promtail.
  - `LOGGING_SETUP.md`: Documentation détaillée sur la mise en place et l'utilisation du système de logging.

## Intégration CI/CD

Le projet utilise GitHub Actions pour automatiser le pipeline CI/CD, défini dans le fichier `.github/workflows/ci-cd.yml`. Ce pipeline est exécuté sur chaque `push` sur les branches `main` et `develop`, ainsi que sur chaque `pull_request` vers `main`.

Les étapes clés du pipeline sont les suivantes :

1.  **Build & Test du Backend**:
    -   Pour chaque microservice (`gateway`, `product-service`, `order-service`), le code Java est compilé et les tests unitaires sont exécutés.
    -   Les artefacts JAR sont ensuite uploadés.

2.  **Build & Test du Frontend**:
    -   Le code React/TypeScript est compilé, le linting est effectué et les tests sont exécutés.
    -   L'artefact de build (`dist`) est ensuite uploadé.

3.  **Analyse de Sécurité - Scan des Dépendances (Trivy)**:
    -   Une analyse des dépendances du backend (Maven) et du frontend (NPM) est effectuée à l'aide de Trivy pour détecter les vulnérabilités critiques, élevées et moyennes.
    -   Les rapports sont générés au format SARIF et uploadés sur GitHub Security pour une visualisation facile.

4.  **Analyse de Sécurité - Analyse de Code (CodeQL)**:
    -   Une analyse statique du code est réalisée pour les langages Java (backend) et JavaScript (frontend) afin d'identifier les vulnérabilités potentielles et les erreurs de sécurité.
    -   Les résultats sont intégrés dans GitHub Code Scanning.

5.  **Analyse de Sécurité - Dockerfile (Hadolint)**:
    -   Les Dockerfiles de chaque service (gateway, product-service, order-service, frontend) sont analysés avec Hadolint pour s'assurer qu'ils respectent les bonnes pratiques de sécurité et d'optimisation.

6.  **Build et Scan des Images Docker**:
    -   Pour chaque service, une image Docker est construite.
    -   Ces images sont ensuite scannées avec Trivy pour détecter les vulnérabilités au niveau de l'image.
    -   Les rapports SARIF sont également uploadés sur GitHub Security.
    -   Les images sont poussées vers Docker Hub si le commit est sur la branche `main` (ou non pour les Pull Requests).

7.  **Validation Docker Compose**:
    -   Le fichier `docker-compose.yml` est validé pour s'assurer de sa syntaxe et de sa cohérence.

8.  **Rapport de Sécurité Final**:
    -   Un résumé des résultats des différentes étapes de sécurité et de build est généré et affiché dans le résumé de l'exécution GitHub Actions.

Ce pipeline assure que toute modification de code subit une série rigoureuse de vérifications de qualité et de sécurité avant d'être potentiellement déployée.

## Structure du Répertoire

```
devsecops/
├── docker-compose.dev.yml   # Docker Compose pour le développement
├── docker-compose.yml       # Docker Compose pour la production/staging
├── grafana-dashboards.yml   # Configuration des dashboards Grafana
├── grafana-datasources.yml  # Configuration des sources de données Grafana
├── LOGGING_SETUP.md         # Documentation de configuration du logging
├── loki-config.yml          # Configuration de Loki
├── promtail-config.yml      # Configuration de Promtail
├── realm-export.json        # Exportation du realm Keycloak
└── grafana-provisioning/    # Provisioning pour Grafana
    ├── dashboards/
    │   └── dashboards.yaml
    └── datasources/
        └── loki.yaml
```