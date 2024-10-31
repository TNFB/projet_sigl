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

  async createUser({ request }: HttpContext) {
    console.log('Create User')
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { full_name, email, password } = request.only(['full_name', 'email', 'password'])
    const createUser = await db.table('users').insert({
      full_name,
      email,
      password,
    })
    console.log(`user created : ${createUser}`)
    return createUser
  }
}
