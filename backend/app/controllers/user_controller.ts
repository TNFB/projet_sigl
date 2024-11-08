import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserController {
  async index() {
    const getAllusers = await db.from('users').select('*')
    if (getAllusers) return getAllusers
    else return null
  }

  async getUserById({ params }: HttpContext) {
    console.log('get user By ID')
    const getuserById = await db.from('users').where('id', params.id).select('*').first()
    console.log(getuserById)
    if (getuserById) return getuserById
    else return null
  }

  async getAllUsers() {
    console.log('get All users')
    const getAllusers = await db.from('users').select('*')
    console.log(getAllusers)
    return getAllusers
  }

  async createUser({ request }: HttpContext) {
    try {
      const { nom, prenom, dateNaissance, genre, email, password, telephone } = request.only([
        'nom',
        'prenom',
        'dateNaissance',
        'genre',
        'email',
        'password',
        'telephone',
      ])
      const createuser = await db
        .table('user')
        .insert({ nom, prenom, dateNaissance, genre, email, password, telephone })
      console.log(`user created: ${createuser}`)
      return createuser
    } catch (error) {
      console.error(error)
      return { error: 'Failed to create user' }
    }
  }
}
