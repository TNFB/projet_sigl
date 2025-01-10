import { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'

// Étendre l'interface Request pour inclure la propriété user
declare module '@adonisjs/core/http' {
  interface Request {
    user?: {
      email: string
    }
  }
}

export default class Auth {
  public async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    if (request.url() === '/connection') {
      await next()
      return
    }
    const token = request.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return response.unauthorized({ message: 'Token is required' })
    }

    try {
      const decoded = jwt.verify(token, process.env.APP_KEY as string) as { email: string }
      (request as any).user = decoded
      await next()
    } catch (error) {
      console.log('Auth middleware: Invalid token', error)
      return response.unauthorized({ message: 'Invalid token' })
    }
  }
}
