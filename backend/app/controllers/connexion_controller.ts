import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class Connexion {
  async connexionUser({ request }: HttpContext) {
    console.log('connexion user')
    try {
      const { email, password } = request.only(['email', 'password'])
      const userDb = await db.from('user').where('email', email).select('*').first()
      console.log(userDb)
      const roleDb = await db.from('admin').where('user_key', userDb.id).select('*').first()
      console.log(roleDb)
      if (userDb.password === password) return { password: true, role: roleDb }
      else return { password: false, role: null }
    } catch (error) {
      console.log(error)
      return 'error in connexionUser'
    }
  }
}
