# Utilisation d'une image Node officielle
FROM node:22.9.0

# Installation de PNPM globalement
RUN npm install -g pnpm

# Définir le dossier de travail dans le conteneur
WORKDIR /app

COPY . .

# Définir le dossier de travail Frontend
WORKDIR /app/front

# Installation des dépendances du projet avec PNPM
RUN pnpm install

ARG ARG_NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_API_URL=${ARG_NEXT_PUBLIC_API_URL}

RUN pnpm build

# Exposer le port utilisé par l'application
EXPOSE 3000

# Commande de démarrage de l'application
CMD ["pnpm", "start"]
