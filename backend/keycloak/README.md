
# Keycloak (Microservices Auth)

## 📌 Description

Keycloak est utilisé comme serveur d’authentification pour le projet microservices.
Il gère :

* Les **realm** (espace de sécurité)
* Les **clients** (applications autorisées)
* Les **utilisateurs** et leurs **rôles**
* L’émission de **JWT** pour sécuriser les microservices et le frontend

Dans ce projet :

* Realm : `microservices-realm`
* Client : `frontend-react`
* Rôles : `ADMIN`, `CLIENT`
* Utilisateurs de test :

    * `admin1` / `admin123` → `ADMIN`
    * `client1` / `client123` → `CLIENT`

---

## 🚀 Lancer Keycloak avec Docker

1. **Télécharger et lancer le conteneur** :

```bash
docker run -d \
  --name keycloak \
  -p 8081:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:21.1.1 start-dev
```

* `KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD` → compte admin pour la console Keycloak
* Le conteneur sera accessible sur `http://localhost:8081/`

2. **Accéder à la console Keycloak** :
   Ouvre `http://localhost:8081/` et connecte-toi avec le compte admin défini (`admin` / `admin`).

---

## 🧩 Configurations importantes

1. **Créer le Realm**

    * Nom : `microservices-realm`

2. **Créer le Client**

    * Nom : `frontend-react`
    * Type : `public`
    * Access Type : `public` (pour le frontend React)
    * Valid Redirect URIs : `http://localhost:3000/*` (ou ton URL frontend)
    * Web Origins : `*` (pour tests locaux)

3. **Créer les rôles**

    * `ADMIN`
    * `CLIENT`

4. **Créer des utilisateurs de test**

    * `admin1` → mot de passe `admin123`, rôle `ADMIN`
    * `client1` → mot de passe `client123`, rôle `CLIENT`

5. **Vérifier**

    * Pour chaque utilisateur, vérifier qu’il possède bien les rôles dans **realm roles**.
    * Les JWT générés contiennent le claim `realm_access.roles` utilisé par les microservices.

---

## ⚡ Vérification rapide

* Ouvrir la console admin et vérifier que :

    * Realm `microservices-realm` existe
    * Client `frontend-react` configuré
    * Les rôles `ADMIN` et `CLIENT` sont présents
    * Les utilisateurs ont bien leurs rôles
* Tester l’authentification avec un navigateur ou Postman : tu devrais obtenir un JWT valide pour les utilisateurs.

