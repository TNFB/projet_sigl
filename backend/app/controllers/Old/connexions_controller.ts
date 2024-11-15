import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class ConnexionsController {
  /**
   * @swagger
   * /connexion:
   *   post:
   *     summary: User login
   *     description: Authenticates a user by email and password, and returns their role.
   *     tags:
   *       - Connexion
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User's email address
   *               password:
   *                 type: string
   *                 description: User's password
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 password:
   *                   type: boolean
   *                 role:
   *                   type: string
   *                   description: Role of the user (user or admin)
   *       401:
   *         description: Incorrect password
   *       404:
   *         description: User or Admin table not found, or user email not found
   *       500:
   *         description: Server error
   */
  async connexionUser({ request, response }: HttpContext) {
    console.log('Connexion')
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
