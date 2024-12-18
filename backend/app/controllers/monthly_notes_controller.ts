import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class MonthluNotesController {
  async createMonthlyNote({ request, response }: HttpContext) {
    console.log('createMonthlyNote')
    try {
      const { email, title, content } = request.only(['email', 'title', 'content'])

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
        idTraningDiary: apprentice.idTrainingDiary,
        creationDate: new Date(),
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
