# Projet SIGL  <!-- omit from toc -->

[![Build develop](https://github.com/TNFB/projet_sigl/actions/workflows/dev-build.yml/badge.svg)](https://github.com/TNFB/projet_sigl/actions/workflows/dev-build.yml)

Ce projet contient un frontend et un backend qui doivent être installés sur deux machines virtuelles (VM) différentes en utilisant Docker. Les images Docker sont hébergées sur un dépôt privé sur `ghcr.io` et nécessitent une authentification.

## Table des matières <!-- omit from toc -->

* [Gestion de code source](#gestion-de-code-source)
  * [Explication des branches](#explication-des-branches)
  * [Workflow GitHub Actions](#workflow-github-actions)
* [Spécifications minimales des VM pour de la production](#spécifications-minimales-des-vm-pour-de-la-production)
* [Installation depuis GHCR.io (GitHub Container Registery)](#installation-depuis-ghcrio-github-container-registery)
  * [Installation de Docker](#installation-de-docker)
  * [Authentification GHCR.io](#authentification-ghcrio)
  * [Authentification Docker](#authentification-docker)
  * [Limitations connues](#limitations-connues)
* [Installation à partir du code source](#installation-à-partir-du-code-source)
  * [Téléchargement du code source](#téléchargement-du-code-source)
  * [Compilation du backend](#compilation-du-backend)
  * [Compilation du frontend](#compilation-du-frontend)
* [Lancement de l'environnement de production](#lancement-de-lenvironnement-de-production)
  * [Lancement du Backend](#lancement-du-backend)
  * [Lancement du Frontend](#lancement-du-frontend)
  * [(Ré)initilisation de la base de données](#réinitilisation-de-la-base-de-données)
* [Installation de l'environnement de développement (Windows)](#installation-de-lenvironnement-de-développement-windows)
  * [Prérequis](#prérequis)
  * [Lancement du backend](#lancement-du-backend-1)
  * [Lancement du frontend](#lancement-du-frontend-1)

## Gestion de code source

### Explication des branches

* `main` : branche principale du projet, contient le code source de la version de production.
* `develop` : branche de développement, contient le code source de la version de développement.
* `Backend` : branche de développement du backend.
* `back-tests` : branche de développement des tests du backend.

### Workflow GitHub Actions

* `main-build` : déclenche le workflow de build de la branche `main`.
* `dev-build` : déclenche le workflow de build de la branche `develop`.

## Spécifications minimales des VM pour de la production

* 1 vCPU (64 bits)
* 1 Go de RAM
* 10 Go de stockage
* 1 interface réseau
* 1 adresse IP publique accessible depuis Internet
* Système d'exploitation
  * Linux (Debian 12 recommandé)
  * Windows (11 recommandé)
  * N'importe quel OS compatible avec Docker

## Installation depuis GHCR.io (GitHub Container Registery)

### Installation de Docker

Pour installer Docker sur une machine Linux, vous pouvez suivre les instructions officielles sur le site de Docker : [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/).
Ensuite, vous pouvez installer Docker Compose en suivant les instructions officielles : [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/).

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

### Limitations connues

* Les images Docker comprennent le site déjà compilé. Si vous souhaitez modifier le nom DNS du backend, vous devrez recompiler le frontend à partir du Dockerfile fourni avec l'argument `ARG_NEXT_PUBLIC_API_URL` défini sur l'URL du backend. Voir la section [Compilation du frontend](#compilation-du-frontend) pour plus d'informations.

## Installation à partir du code source

### Téléchargement du code source

Se rendre sur le dépôt GitHub du projet dans la branche `main`, puis cliquer sur le bouton `Code` et choisir `Download ZIP`. Extraire le contenu de l'archive dans un dossier de votre choix sur la VM.

### Compilation du backend

Se rendre dans le dossier `backend` du projet et exécuter la commande suivante :

```sh
docker build -t ghcr.io/tnfb/projet_sigl/backend:latest .
```

### Compilation du frontend

Se rendre dans le dossier `front` du projet et exécuter la commande suivante, en remplaçant `URL_backend` par l'URL publique du backend :

```sh
docker build -t ghcr.io/tnfb/projet_sigl/front:latest --build-arg ARG_NEXT_PUBLIC_API_URL=URL_backend .
```

## Lancement de l'environnement de production

### Lancement du Backend

1. Connectez-vous à la VM dédiée au backend.
2. Copier le fichier docker/docker-compose-backend.yml sur la VM.
3. Éditer les variables d'environnements dans le fichier pour le backend :
   1. `DB_HOST` : l'adresse du serveur de base de données.
   2. `DB_PORT` : le port du serveur de base de données.
   3. `DB_USER` : l'utilisateur de la base de données.
   4. `DB_PASSWORD` : le mot de passe de l'utilisateur de la base de données.
   5. `LOG_LEVEL` : le niveau de log du backend
4. Éditer le volume du stockage des fichiers utilisateurs :
   1. Remplacer `~chemin de stockage machine hôte~` par le chemin de stockage sur la machine hôte. (Exemple pour Debian : `/home/user/storage`)
5. Éditer les variables d'environnements dans le fichier pour PHPMyAdmin :
   1. `PMA_HOST` : l'adresse du serveur de base de données.
   2. `PMA_PORT` : le port du serveur de base de données.
   3. `PMA_ABSOLUTE_URI` : l'URL absolue de phpmyadmin.
6. Modifier (ou non) les ports attribués aux conteneurs.
   * Par défaut, le backend est exposé sur le port 3333 et PHPMyAdmin sur le port 60000.
   * Pour modifier un port, changer le premier nombre du port (Exemple 3333:3333 -> 3334:3333). Le port exposé à l'utilisateur sera donc 3334.
7. Lancer le backend (la version du conteneur est celle  spécifiée par la variable `image`, par défaut : `latest`):

    ```sh
    docker compose -f docker-compose-backend.yml up -d
    ```

### Lancement du Frontend

1. Connectez-vous à la VM dédiée au frontend.
2. Copier le fichier docker/docker-compose-front.yml sur la VM.
3. Modifier (ou non) le port attribué au conteneur.
   * Par défaut, le front est exposé sur le port 3000.
   * Pour modifier le port, changer le premier nombre du port (Exemple 3000:3000 -> 3001:3000). Le port exposé à l'utilisateur sera donc 3001.
4. Lancer le front (la version du conteneur est celle  spécifiée par la variable `image`, par défaut : `latest`):

    ```sh
    docker compose -f docker-compose-front.yml up -d
    ```

### (Ré)initilisation de la base de données

Pour (ré)initiliser la base de données avec des données de base, se connecter à la VM dédiée au backend puis au conteneur du backend :

```sh
docker exec -it back bash
```

Puis exécuter les commandes suivantes :

```sh
cd /app/backend/build
node ace migration:refresh --seed
exit
```

## Installation de l'environnement de développement (Windows)

### Prérequis

* Node.js
* WAMP
* Le module `pnpm` pour Node.js (installable avec `npm install -g pnpm`)

### Lancement du backend

Démarrer WAMP et s'assurer que le serveur MySQL est en cours d'exécution.

Se rendre dans le dossier `backend` du projet et exécuter la commande suivante :

```sh
pnpm install
```

Puis lancer le backend avec la commande suivante :

```sh
node ace serve --watch
```

### Lancement du frontend

Se rendre dans le dossier `front` du projet et exécuter la commande suivante :

```sh
pnpm install
```

Puis lancer le frontend avec la commande suivante :

```sh
pnpm run dev
```
