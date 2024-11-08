import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserController {
  async index() {
    const getAllacteurs = await db.from('acteur').select('*')
    if (getAllacteurs) return getAllacteurs
    else return null
  }

  async getActeurById({ params }: HttpContext) {
    console.log('get acteur By ID')
    const getActeurById = await db.from('acteur').where('id', params.id).select('*').first()
    console.log(getActeurById)
    if (getActeurById) return getActeurById
    else return null
  }

  async getAllActeurs() {
    console.log('get All acteurs')
    const getAllActeurs = await db.from('acteur').select('*')
    console.log(getAllActeurs)
    return getAllActeurs
  }

  async createActeur({ request }: HttpContext) {
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
      const createActeur = await db
        .table('acteur')
        .insert({ nom, prenom, dateNaissance, genre, email, password, telephone })
      console.log(`Acteur created: ${createActeur}`)
      return createActeur
    } catch (error) {
      console.error(error)
      return { error: 'Failed to create acteur' }
    }
  }
}
