import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class EducationalTutorsController {
  async addApprentices({ request, response }: HttpContext) {
    try {
      const { tutorId, apprenticeIds } = request.only(['tutorId', 'apprenticeIds'])

      // master existe ?
      const master = await db.from('educational_tutors').where('id', tutorId).first()
      if (!master) {
        return response.status(404).json({ message: 'educational tutors not found' })
      }

      // get apprentice list (if existe)
      let currentApprentices = master.listeIdApprentice ? JSON.parse(master.listeIdApprentice) : []

      // add new apprentices ID
      const newApprentices = [...new Set([...currentApprentices, ...apprenticeIds])]

      // Start Transaction
      await db.transaction(async (trx) => {
        // Update educational_tutors
        await trx
          .from('educational_tutors')
          .where('id', tutorId)
          .update({ listeIdApprentice: JSON.stringify(newApprentices) })

        // Update table apprentices for each apprentice
        for (const apprenticeId of apprenticeIds) {
          await trx
            .from('apprentices')
            .where('id', apprenticeId)
            .update({ idEducationalTutor: tutorId })
        }
      })

      return response.status(200).json({ message: 'Apprentices added successfully' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'An error occurred while adding apprentices' })
    }
  }
}
