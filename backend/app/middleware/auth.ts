import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'

export default class Auth {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    if (request.url() === '/connection') {
      await next()
      return
    }
    const token = request.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return response.unauthorized({ message: 'Token is required' })
    }

    try {
      const decoded = jwt.verify(token, process.env.APP_KEY)
      request.user = decoded
      await next()
    } catch (error) {
      console.log('Auth middleware: Invalid token', error)
      return response.unauthorized({ message: 'Invalid token' })
    }
  }
}
