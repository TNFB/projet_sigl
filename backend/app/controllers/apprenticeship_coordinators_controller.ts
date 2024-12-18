import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class ApprenticeshipCoordinatorsController {
  async linkApprentice({ request, response }: HttpContext) {
    try {
      const { apprenticeEmail, masterEmail, tutorEmail } = request.only([
        'apprenticeEmail',
        'masterEmail',
        'tutorEmail',
      ])

      // Vérifier si l'apprenti existe et s'il a le bon rôle
      const apprentice = await db
        .from('users')
        .where('email', apprenticeEmail)
        .where('role', 'apprentices')
        .first()
      if (!apprentice) {
        return response.status(404).json({ message: 'Apprenti non trouvé ou rôle incorrect' })
      }

      // Vérifier si le maître d'apprentissage existe et s'il a le bon rôle
      const apprenticeMaster = await db
        .from('users')
        .where('email', masterEmail)
        .where('role', 'apprentice_masters')
        .first()
      if (!apprenticeMaster) {
        return response
          .status(404)
          .json({ message: "Maître d'apprentissage non trouvé ou rôle incorrect" })
      }

      // Vérifier si le tuteur pédagogique existe et s'il a le bon rôle
      const educationalTutor = await db
        .from('users')
        .where('email', tutorEmail)
        .where('role', 'educational_tutors')
        .first()
      if (!educationalTutor) {
        return response
          .status(404)
          .json({ message: 'Tuteur pédagogique non trouvé ou rôle incorrect' })
      }

      // Mettre à jour l'enregistrement de l'apprenti pour lier les IDs
      await db.from('apprentices').where('id', apprentice.idUser).update({
        idApprenticeMaster: apprenticeMaster.idUser,
        idEducationalTutor: educationalTutor.idUser,
      })

      return response.status(200).json({
        message:
          "Liaison créée avec succès entre l'apprenti, le maître d'apprentissage et le tuteur pédagogique",
        apprenticeId: apprentice.idUser,
        masterId: apprenticeMaster.idUser,
        tutorId: educationalTutor.idUser,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: 'Une erreur est survenue lors de la création de la liaison',
        error: error.message,
      })
    }
  }
}
