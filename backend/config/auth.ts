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
        identifierKey: 'id_user',
        uids: ['email'],
        model: () => import('#models/user'),
      },
    },
  },
}

export default authConfig
