# Utilisation d'une image Node officielle
FROM node:22.9.0

# Installation de PNPM globalement
RUN npm install -g pnpm@9.4.0

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et pnpm-lock.yaml
COPY . .

# Définir le dossier de travail backend
WORKDIR /app/backend

# Installation des dépendances du projet avec PNPM
RUN pnpm install

RUN pnpm build

WORKDIR /app/backend/build

RUN pnpm i --prod

# Exposer le port utilisé par l'application
EXPOSE 3333

# Commande de démarrage de l'application
CMD ["pnpm", "start"]
