import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class ApprenticeshipCoordinatorsController {
  async linkApprentice({ request, response }: HttpContext) {
    try {
      const { data } = request.only(['data'])

      if (!Array.isArray(data) || data.length === 0) {
        return response
          .status(400)
          .json({ message: 'Invalid input: data should be a non-empty array' })
      }

      const results = []

      for (const liaison of data) {
        const { apprenticeEmail, masterEmail, tutorEmail } = liaison

        // Vérifier si l'apprenti existe et s'il a le bon rôle
        const apprentice = await db
          .from('users')
          .where('email', apprenticeEmail)
          .where('role', 'apprentices')
          .first()
        if (!apprentice) {
          results.push({
            status: 'error',
            message: 'Apprenti non trouvé ou rôle incorrect',
            apprenticeEmail,
          })
          continue
        }

        // Vérifier si le maître d'apprentissage existe et s'il a le bon rôle
        const apprenticeMaster = await db
          .from('users')
          .where('email', masterEmail)
          .where('role', 'apprentice_masters')
          .first()
        if (!apprenticeMaster) {
          results.push({
            status: 'error',
            message: "Maître d'apprentissage non trouvé ou rôle incorrect",
            masterEmail,
          })
          continue
        }

        // Vérifier si le tuteur pédagogique existe et s'il a le bon rôle
        const educationalTutor = await db
          .from('users')
          .where('email', tutorEmail)
          .where('role', 'educational_tutors')
          .first()
        if (!educationalTutor) {
          results.push({
            status: 'error',
            message: 'Tuteur pédagogique non trouvé ou rôle incorrect',
            tutorEmail,
          })
          continue
        }

        // Mettre à jour l'enregistrement de l'apprenti pour lier les IDs
        await db.from('apprentices').where('id', apprentice.idUser).update({
          idApprenticeMaster: apprenticeMaster.idUser,
          idEducationalTutor: educationalTutor.idUser,
        })

        results.push({
          status: 'success',
          message: 'Liaison créée avec succès',
          apprenticeId: apprentice.idUser,
          masterId: apprenticeMaster.idUser,
          tutorId: educationalTutor.idUser,
        })
      }

      return response.status(200).json({
        message: 'Traitement des liaisons terminé',
        results,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: 'Une erreur est survenue lors du traitement des liaisons',
        error: error.message,
      })
    }
  }
}
