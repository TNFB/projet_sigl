import path from 'node:path'
import url from 'node:url'

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../', // pour AdonisJS v6
  title: 'Foo', // Nom du projet
  version: '1.0.0',
  description: 'API Documentation for Foo',
  tagIndex: 2,
  info: {
    title: 'Foo API',
    version: '1.0.0',
    description: 'This is the API documentation for Foo application.',
  },
  snakeCase: true,

  debug: true, // Activer les logs pour déboguer si nécessaire
  ignore: ['/swagger', '/docs'], // Ignorer les routes Swagger
  preferredPutPatch: 'PUT',
  common: {
    parameters: {},
    headers: {},
  },
  securitySchemes: {}, // Ajouter si vous utilisez un schéma d'authentification
  authMiddlewares: ['auth', 'auth:api'],
  defaultSecurityScheme: 'BearerAuth',
  persistAuthorization: true,
  showFullPath: false,

  // Ajoutez le chemin de vos fichiers où Swagger doit chercher les annotations
  options: {
    apis: [
      'app/**/*.ts', // Incluez vos contrôleurs et fichiers associés
      'start/routes.ts', // Si vous utilisez des annotations directement dans vos routes
    ],
  },
}
