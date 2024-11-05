import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserController {
  index() {
    return db.from('acteur').select('*')
  }

  async getActeurById({ params }: HttpContext) {
    console.log('get acteur By ID')
    const getActeurById = await db.from('acteurs').where('id', params.id).select('*').first()
    console.log(getActeurById)
    return getActeurById
  }

  async getAllActeurs() {
    console.log('get acteurs By ID')
    const getAllActeurs = await db.from('acteurs').select('*')
    console.log(getAllActeurs)
    return getAllActeurs
  }

  async createActeur({ request }: HttpContext) {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { nom, prenom, date_naissance, genre, email, password, telephone } = request.only([
        'nom',
        'prenom',
        'date_naissance',
        'genre',
        'email',
        'password',
        'telephone',
      ])
      const createActeur = await db
        .table('acteurs')
        .insert({ nom, prenom, date_naissance, genre, email, password, telephone })
      console.log(`Acteur created: ${createActeur}`)
      return createActeur
    } catch (error) {
      console.error(error)
      return { error: 'Failed to create acteur' }
    }
  }
}
