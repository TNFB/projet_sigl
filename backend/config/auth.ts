const authConfig = {
  guard: 'api',
  guards: {
    api: {
      driver: 'oat', // Utilisez 'oat' pour API ou 'jwt' si nécessaire
      tokenProvider: {
        driver: 'database', // Si vous utilisez des tokens stockés en base, sinon utilisez 'jwt'
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'idUser', // Assurez-vous que votre colonne utilisateur correspond
        uids: ['email'],
        model: () => import('#models/user'),
      },
    },
  },
}

export default authConfig
