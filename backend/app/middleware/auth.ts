import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Auth {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    try {
      await auth.use('api').authenticate()
      await next()
    } catch {
      return response.unauthorized({ message: 'You must be logged in to access this resource' })
    }
  }
}
