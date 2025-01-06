import { HttpContext } from '@adonisjs/core/http'

export interface CustomHttpContext extends HttpContext {
  request: HttpContext['request'] & {
    user: {
      email: string
    }
  }
}
