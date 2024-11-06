import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class Connexion {
  async connexionActeur({ request }: HttpContext) {
    console.log('connexion acteur')
    try {
      const { email, password } = request.only(['email', 'password'])
      const acteurDb = await db.from('acteur').where('email', email).select('*').first()
      console.log(acteurDb.id)
      const roleDb = await db.from('admin').where('acteur_key', acteurDb.id).select('*').first()
      console.log(roleDb)
      if (acteurDb.password === password) return { password: true, role: roleDb }
      else return { password: false, role: null }
    } catch (error) {
      console.log(error)
      return 'error in connexionActeur'
    }
  }
}
