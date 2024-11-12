import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class ConnexionsController {
  async connexionUser({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      // check if table 'users' empty
      const userCount = await db.from('users').count('* as total')
      if (userCount[0].total === 0) {
        console.log('User table empty')
        return response.status(404).json({
          status: 'error',
          message: 'No User table found/User table empty',
        })
      }

      // check if table 'admin' empty
      const adminCount = await db.from('users').count('* as total')
      if (userCount[0].total === 0) {
        console.log('User table empty')
        return response.status(404).json({
          status: 'error',
          message: 'No Admin table found/Admin table empty',
        })
      }

      // Table users not empty
      const userDb = await db.from('users').where('email', email).select('*').first()
      if (!userDb) {
        return response.status(404).json({
          status: 'error',
          message: 'Email not found',
        })
      }

      var roleDb = 'user'
      if (adminCount[0] !== 0) {
        var role = await db.from('admin').where('user_key', userDb.id).select('*').first()
        console.log(role)
        if (role) {
          roleDb = 'admin'
        }
      }

      if (userDb.password === password) {
        return response.status(200).json({
          status: 'success',
          password: true,
          role: roleDb,
        })
      } else {
        return response.status(401).json({
          status: 'error',
          password: false,
          message: 'password incorrect',
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in users connetion',
      })
    }
  }
}