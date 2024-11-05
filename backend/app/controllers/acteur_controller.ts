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
        .table('acteur')
        .insert({ nom, prenom, date_naissance, genre, email, password, telephone })
      console.log(`Acteur created: ${createActeur}`)
      return createActeur
    } catch (error) {
      console.error(error)
      return { error: 'Failed to create acteur' }
    }
  }

  async connexionActeur({ request }: HttpContext) {
    console.log('connexion acteur')
    try {
      const { email, password } = request.only(['email', 'password'])
      const dbPassword = await db.from('acteur').where('email', email).select('*').first()
      console.log(dbPassword)
      if (dbPassword.password === password) return true
      else return false
    } catch (error) {
      console.log(error)
      return 'error in connexionActeur'
    }
  }
}
