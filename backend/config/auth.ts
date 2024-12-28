import { AuthConfig } from '@ioc:Adonis/Addons/Auth'

const authConfig: AuthConfig = {
  guard: 'api',
  guards: {
    api: {
      driver: 'jwt',
      tokenProvider: {
        type: 'jwt',
        driver: 'jwt',
        secret: process.env.APP_KEY,
        options: {
          expiresIn: '1h',
        },
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'id_user',
        uids: ['email'],
        model: () => import('App/Models/User'),
      },
    },
  },
}

export default authConfig
