# Projet SIGL

[![Build develop](https://github.com/TNFB/projet_sigl/actions/workflows/dev-build.yml/badge.svg)](https://github.com/TNFB/projet_sigl/actions/workflows/dev-build.yml)

Ce projet contient un frontend et un backend qui doivent être installés sur deux machines virtuelles (VM) différentes en utilisant Docker. Les images Docker sont hébergées sur un dépôt privé sur `ghcr.io` et nécessitent une authentification.

- [Projet SIGL](#projet-sigl)
  - [Installation depuis GHCR.io (GitHub Container Registery)](#installation-depuis-ghcrio-github-container-registery)
    - [Prérequis](#prérequis)
    - [Authentification GHCR.io](#authentification-ghcrio)
    - [Authentification Docker](#authentification-docker)
    - [Installation du Backend](#installation-du-backend)
    - [Installation du Frontend](#installation-du-frontend)
    - [Limitations connues](#limitations-connues)
  - [Installation de l'environnement de développement (Windows)](#installation-de-lenvironnement-de-développement-windows)
    - [Prérequis](#prérequis-1)
    - [Installation de Node.js](#installation-de-nodejs)
    - [Installation de WAMP](#installation-de-wamp)
    - [Lancement du backend](#lancement-du-backend)
    - [Lancement du frontend](#lancement-du-frontend)


## Installation depuis GHCR.io (GitHub Container Registery)

### Prérequis

- Deux VM configurées et accessibles (à développer)
- Docker installé sur les deux VM (à développer)
- Accès au dépôt privé sur Github

### Authentification GHCR.io

Pour accéder aux images Docker, vous devez disposer d'un token d'accès personnel (PAT) classique. Vous pouvez en générer un sur GitHub en suivant ces étapes :

1. Connectez-vous à votre compte GitHub.
2. Cliquez sur votre photo de profil en haut à droite.
3. Cliquez sur `Settings`.
4. Dans le menu de gauche, cliquez sur `Developer settings`.
5. Dans le menu de gauche, cliquez sur `Personal access tokens`.
6. Cliquez sur `Token (classic)`.
7. Cliquez sur `Generate new token`.
8. Cliquer sur `Generate new token (classic)`.
9. Donnez un nom à votre token et sélectionnez les autorisations `repo` et `read:packages`.
10. Cliquez sur `Generate token`.
11. Sauvegardez votre token d'accès personnel. Vous ne pourrez plus le voir après avoir quitté la page.

### Authentification Docker

Avant de pouvoir tirer les images Docker, vous devez vous authentifier auprès de `ghcr.io` :

```sh
echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
```

Remplacez `CR_PAT` par votre token d'accès personnel et `USERNAME` par votre nom d'utilisateur GitHub (et non pas votre adresse e-mail).

### Installation du Backend

1. Connectez-vous à la VM dédiée au backend.
2. Copier le fichier docker/docker-compose-backend.yml sur la VM.
3. Éditer les variables d'environnements dans le fichier pour le backend :
   1. `PORT` : le port sur lequel le backend sera exposé.
   2. `DB_HOST` : l'adresse du serveur de base de données.
   3. `DB_PORT` : le port du serveur de base de données.
   4. `DB_USER` : l'utilisateur de la base de données.
   5. `DB_PASSWORD` : le mot de passe de l'utilisateur de la base de données.
   6. `LOG_LEVEL` : le niveau de log du backend
4. Éditer les variables d'environnements dans le fichier pour phpmyadmin :
   1. `PMA_HOST` : l'adresse du serveur de base de données.
   2. `PMA_PORT` : le port du serveur de base de données.
   3. `PMA_ABSOLUTE_URI` : l'URL absolue de phpmyadmin.
5. Lancer le backend (la version du conteneur est celle  spécifiée par la variable `image`, par défaut : `latest`):

    ```sh
    docker compose -f docker-compose-backend.yml up -d
    ```

### Installation du Frontend

1. Connectez-vous à la VM dédiée au frontend.
2. Copier le fichier docker/docker-compose-front.yml sur la VM.
3. Lancer le front (la version du conteneur est celle  spécifiée par la variable `image`, par défaut : `latest`):

    ```sh
    docker compose -f docker-compose-front.yml up -d
    ```

### Limitations connues

- Les images Docker comprennent le site déjà compilé. Si vous souhaitez modifier le nom DNS du backend, vous devrez recompiler le frontend à partir du Dockerfile fourni avec l'argument `ARG_NEXT_PUBLIC_API_URL` défini sur l'URL du backend.

## Installation de l'environnement de développement (Windows)

### Prérequis

### Installation de Node.js

### Installation de WAMP

### Lancement du backend

### Lancement du frontend
