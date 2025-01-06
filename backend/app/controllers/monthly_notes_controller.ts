import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import { isValidRole } from '../utils/api_utils.js'

export default class MonthluNotesController {
  async createMonthlyNote({ request, response }: HttpContext) {
    console.log('createMonthlyNote')
    try {
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { email, title, content } = data

      const emailUser = request.user.email
      // Vérifier si l'admin existe et si le token est valide
      if (!(await isValidRole(emailUser, 'admins'))) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid role, token, or token has expired',
        })
      }

      // Vérifier si l'utilisateur existe et s'il est un apprenti
      const user = await db.from('users').where('email', email).first()

      if (!user || user.role !== 'apprentices') {
        return response.status(403).json({
          message: 'Utilisateur non trouvé ou non autorisé',
        })
      }

      // Récupérer l'id de l'apprenti
      const apprentice = await db.from('apprentices').where('id', user.id).first()

      if (!apprentice) {
        return response.status(400).json({
          message: 'Apprenti non trouvé',
        })
      }

      // Insérer la nouvelle note mensuelle
      const [newNoteId] = await db.table('monthly_notes').insert({
        id_traning_diary: apprentice.id_training_diary,
        creation_date: new Date(),
        title,
        content,
      })

      return response.status(201).json({
        message: 'Note mensuelle créée',
        noteId: newNoteId,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur lors de la création de la note mensuelle',
      })
    }
  }
}
