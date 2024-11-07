import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class Connexion {
  async connexionActeur({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      // check if table 'acteur' empty
      const acteurCount = await db.from('acteur').count('* as total')
      if (acteurCount[0].total === 0) {
        console.log('Acteur table empty')
        return response.status(404).json({
          status: 'error',
          message: 'No acteur table found/acteur table empty',
        })
      }

      // Table not empty
      const acteurDb = await db.from('acteur').where('email', email).select('*').first()
      if (!acteurDb) {
        return response.status(404).json({
          status: 'error',
          message: 'Email not found',
        })
      }

      var roleDb = await db.from('admin').where('acteur_key', acteurDb.id).select('*').first()
      console.log(roleDb)
      if (!roleDb) {
        roleDb = 'admin'
      } else roleDb = 'user'

      if (acteurDb.password === password) {
        return response.status(200).json({
          status: 'success',
          password: true,
          role: roleDb,
        })
      } else {
        return response.status(401).json({
          status: 'error',
          password: false,
          role: roleDb,
          message: 'password incorrect',
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in acteur connetion',
      })
    }
  }
}
