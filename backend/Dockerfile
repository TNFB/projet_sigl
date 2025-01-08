# Utilisation d'une image Node officielle
FROM node:22.9.0

# Installation de PNPM globalement
RUN npm install -g pnpm@9.15.1

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers
COPY . .

# Installation des dépendances du projet avec PNPM
RUN pnpm install

RUN pnpm build

WORKDIR /app/build

RUN pnpm i --prod

ENV DRIVE_DISK=fs
ENV HOST=0.0.0.0
ENV APP_KEY=xLxMeTQzOqYhsjMzrCWjeNG0gdqRBwuf
ENV NODE_ENV=production
ENV SESSION_DRIVER=cookie
ENV DB_DATABASE=sigl_db

VOLUME [ "/app/build/storage" ]

# Exposer le port utilisé par l'application
EXPOSE 3333

# Commande de démarrage de l'application
CMD ["pnpm", "start"]
