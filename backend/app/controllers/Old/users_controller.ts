import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index() {}

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Get user by ID
   *     description: Retrieve a user by their unique ID.
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The ID of the user to retrieve.
   *     responses:
   *       200:
   *         description: User details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 users:
   *                   type: object
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */
  async getUserById({ params, response }: HttpContext) {
    console.log('getUserById')
    try {
      // check if table 'users' empty
      const acteurCount = await db.from('users').count('* as total')
      if (acteurCount[0].total === 0) {
        console.log('User table empty')
        return response.status(404).json({
          status: 'error',
          message: 'No users table found/users table empty',
        })
      }
      //Table Not Empty
      const getUserById = await db.from('users').where('id', params.id).select('*').first()
      if (getUserById !== null) {
        return response.status(200).json({
          status: 'success',
          users: getUserById,
        })
      } else {
        return response.status(404).json({
          status: 'error',
          message: 'No users table found',
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in getUserByID',
      })
    }
  }

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users
   *     description: Retrieve a list of all users.
   *     tags:
   *       - Users
   *     responses:
   *       200:
   *         description: List of users
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *       404:
   *         description: No users found
   *       500:
   *         description: Server error
   */
  async getAllUsers({ response }: HttpContext) {
    console.log('getAllUsers')
    try {
      // check if table 'users' empty
      const acteurCount = await db.from('users').count('* as total')
      if (acteurCount[0].total === 0) {
        console.log('User table empty')
        return response.status(404).json({
          status: 'error',
          message: 'No users table found/users table empty',
        })
      }
      //Table Not Empty
      const getAllacteurs = await db.from('users').select('*')
      return response.status(200).json({
        status: 'success',
        users: getAllacteurs,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in getUserByID',
      })
    }
  }

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user
   *     description: Add a new user to the database.
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               firstName:
   *                 type: string
   *               dateBirth:
   *                 type: string
   *                 format: date
   *               genre:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *               telephone:
   *                 type: string
   *     responses:
   *       200:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 message:
   *                   type: string
   *                 users:
   *                   type: object
   *       404:
   *         description: Users table not found or empty
   *       500:
   *         description: Server error
   */
  async createUser({ request, response }: HttpContext) {
    console.log('createUser')
    try {
      const { name, firstName, dateBirth, genre, email, password, telephone } = request.only([
        'name',
        'firstName',
        'dateBirth',
        'genre',
        'email',
        'password',
        'telephone',
      ])
      // check if table 'users' empty
      const acteurCount = await db.from('users').count('* as total')
      if (acteurCount[0].total === 0) {
        console.log('User table empty')
        return response.status(404).json({
          status: 'error',
          message: 'No users table found/users table empty',
        })
      }
      const createUser = await db
        .table('users')
        .insert({ name, firstName, dateBirth, genre, email, password, telephone })
      console.log(`User created: ${createUser}`)
      return response.status(200).json({
        status: 'success',
        message: 'users created',
        users: createUser,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in getUserByID',
      })
    }
  }
}
