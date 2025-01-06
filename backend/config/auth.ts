const authConfig = {
  guard: 'api',
  guards: {
    api: {
      driver: 'oat',
      tokenProvider: {
        driver: 'database',
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'idUser',
        uids: ['email'],
        model: () => import('#models/user'),
      },
    },
  },
}

export default authConfig
