import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index() {}

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
      if (getUserById !== null){
        return response.status(200).json({
          status: 'success',
          users: getUserById,
        })
      }
      else {
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