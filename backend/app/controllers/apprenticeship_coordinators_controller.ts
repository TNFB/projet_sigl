import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import { isValidRole } from 'app/utils/apiUtils.js'

export default class ApprenticeshipCoordinatorsController {
  public async linkApprentice({ request, response }: HttpContext) {
    try {
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }

      const { peopleData, token } = data

      const emailUser = request.user.email
      // Vérifier si l'admin existe et si le token est valide
      if (!(await isValidRole(emailUser, 'admins'))) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid role, token, or token has expired',
        })
      }

      if (!Array.isArray(peopleData) || peopleData.length === 0) {
        return response
          .status(400)
          .json({ message: 'Invalid input: data should be a non-empty array' })
      }

      const results = []

      for (const liaison of peopleData) {
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
        await db.from('apprentices').where('id', apprentice.id_user).update({
          id_apprentice_master: apprenticeMaster.id_user,
          id_educational_tutor: educationalTutor.id_user,
        })

        results.push({
          status: 'success',
          message: 'Liaison créée avec succès',
          apprenticeId: apprentice.id_user,
          masterId: apprenticeMaster.id_user,
          tutorId: educationalTutor.id_user,
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
