import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserController {
  async index() {}

  async getActeurById({ params, response }: HttpContext) {
    try {
      // check if table 'acteur' empty
      const acteurCount = await db.from('acteur').count('* as total')
      if (acteurCount[0].total === 0) {
        console.log('Acteur table empty')
        return response.status(404).json({
          status: 'error',
          message: 'No acteur table found/acteur table empty',
        })
      }
      //Table Not Empty
      const getActeurById = await db.from('acteur').where('id', params.id).select('*').first()
      return response.status(200).json({
        status: 'success',
        acteur: getActeurById,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in getActeurByID',
      })
    }
  }

  async getAllActeurs({ response }: HttpContext) {
    try {
      // check if table 'acteur' empty
      const acteurCount = await db.from('acteur').count('* as total')
      if (acteurCount[0].total === 0) {
        console.log('Acteur table empty')
        return response.status(404).json({
          status: 'error',
          message: 'No acteur table found/acteur table empty',
        })
      }
      //Table Not Empty
      const getAllacteurs = await db.from('acteur').select('*')
      return response.status(200).json({
        status: 'success',
        acteur: getAllacteurs,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in getActeurByID',
      })
    }
  }

  async createActeur({ request, response }: HttpContext) {
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
      // check if table 'acteur' empty
      const acteurCount = await db.from('acteur').count('* as total')
      if (acteurCount[0].total === 0) {
        console.log('Acteur table empty')
        return response.status(404).json({
          status: 'error',
          message: 'No acteur table found/acteur table empty',
        })
      }
      const createActeur = await db
        .table('acteur')
        .insert({ nom, prenom, dateNaissance, genre, email, password, telephone })
      console.log(`Acteur created: ${createActeur}`)
      return response.status(200).json({
        status: 'success',
        message: 'acteur created',
        acteur: createActeur,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in getActeurByID',
      })
    }
  }
}
