import db from '@adonisjs/lucid/services/db'
import { HttpContext } from '@adonisjs/core/http'
import { isValidRole } from '../utils/api_utils.js'

/**
 * @class TrainingDiariesController
 * @brief Contrôleur pour gérer les journaux d'entraînement.
 *
 * Ce contrôleur fournit des méthodes pour créer et gérer les journaux d'entraînement des utilisateurs.
 */
export default class TrainingDiariesController {
  /**
   * @brief Crée un nouveau journal d'entraînement pour un utilisateur.
   *
   * Cette méthode vérifie si l'utilisateur existe et s'il a le rôle d'apprenti avant de créer un nouveau
   * journal d'entraînement. Si l'utilisateur est autorisé, elle enregistre le journal dans la base de données
   * et met à jour l'ID du journal d'entraînement dans la table des apprentis.
   *
   * @param {HttpContext} context - Le contexte HTTP contenant la requête et la réponse.
   * @param {Object} context.request - L'objet de requête HTTP contenant les données nécessaires à la création du journal.
   * @param {Object} context.response - L'objet de réponse HTTP utilisé pour renvoyer des réponses au client.
   *
   * @throws {Forbidden} Si l'utilisateur n'est pas trouvé ou n'est pas autorisé à créer un journal.
   * @throws {InternalServerError} En cas d'erreur lors du traitement de la création du journal.
   *
   * @return {Promise<Object>} - Une promesse qui résout un objet JSON contenant un message de succès
   *                             et l'ID du journal d'entraînement créé ou une erreur en cas d'échec.
   */
  async createTraningDiary({ request, response }: HttpContext) {
    console.log('createTraningDiary')
    try {
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { id_user } = data

      const emailUser = (request as any).user?.email
      if (!emailUser) {
        return response.status(401).json({ error: 'Unauthorized' })
      }
      // Vérifier si l'admin existe et si le token est valide
      if (!(await isValidRole(emailUser, 'admins'))) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid role',
        })
      }

      const user = await db.from('users').where('id_user', id_user).first()
      if (user && user.role === 'apprentices') {
        const apprentice = await db.from('apprentices').where('id', id_user).first()

        if (apprentice && apprentice.id_training_diary) {
          return response.status(400).json({
            message: 'Un journal de formation existe déjà pour cet utilisateur',
            trainingDiaryId: apprentice.id_training_diary,
          })
        }

        // Si aucun journal n'existe, en créer un nouveau
        const [newTrainingDiaryId] = await db.table('training_diaries').insert({
          created_at: new Date(),
        })

        await db
          .from('apprentices')
          .where('id', id_user)
          .update({ id_training_diary: newTrainingDiaryId })

        return response.status(200).json({
          message: 'Training Diary created',
          trainingDiaryId: newTrainingDiaryId,
        })
      } else {
        return response.notFound({
          message: 'user not found or not authorised',
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in createTraningDiary',
      })
    }
  }
}
