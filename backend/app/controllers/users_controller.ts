import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
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
        message: 'Erreur in getAllUser',
      })
    }
  }

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user
   *     description: Add a new user to the database with optional role assignment.
   *     tags:
   *       - Users
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
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 example: secret123
   *               name:
   *                 type: string
   *                 example: John
   *               lastName:
   *                 type: string
   *                 example: Doe
   *               telephone:
   *                 type: string
   *                 example: "+1234567890"
   *               role:
   *                 type: string
   *                 description: Optional role for the user (e.g., 'admin', 'user').
   *                 example: admin
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
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: users created
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
      const { email, password, name, lastName, telephone, role } = request.only([
        'email',
        'password',
        'name',
        'lastName',
        'telephone',
        'role',
      ])

      const getEmail = await db.from('users').where('email', email).count('* as total')
      if (getEmail[0].total > 0) {
        return response.status(400).json({
          status: 'error',
          message: `email: ${email} already existe in DB`,
        })
      }

      const createUser = await db
        .table('users')
        .insert({ email, password, name, lastName, telephone, role })
      console.log(`User created: ${createUser}`)

      //assigne Role
      var assigneRole = []
      let id = createUser
      if (role !== 'admins' && role !== null) {
        assigneRole = await db.table(role).insert({ id })
      } else {
        return response.status(400).json({
          status: 'error',
          message: 'bad request, role is null or admin',
        })
      }
      console.log(`User Role created ${assigneRole}`)
      return response.status(200).json({
        status: 'success',
        message: 'users created',
        users: createUser,
        role: role,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in createUser',
      })
    }
  }

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
  async connectionUser({ request, response }: HttpContext) {
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

  //async deconexionUser({ request, response }: HttpContext) {}
}
