import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserController {
  index() {
    return db.from('user').select('*')
  }

  async getUserById({ params }: HttpContext) {
    console.log('get User By ID')
    const getUserById = await db.from('users').where('id', params.id).select('*').first()
    console.log(getUserById)
    return getUserById
  }

  async getAllUser() {
    console.log('get User By ID')
    const getAllUser = await db.from('users').select('*')
    console.log(getAllUser)
    return getAllUser
  }


  async createUser({ request }: HttpContext) {
    try {
        const { full_name, email, password } = request.only(['full_name', 'email', 'password']);
        const createUser = await db.table('users').insert({ full_name, email, password });
        console.log(`User created: ${createUser}`);
        return createUser;
    } catch (error) {
        console.error(error);
        return { error: 'Failed to create user' };
    }
  }
}
