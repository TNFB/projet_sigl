import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

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
      const { idUser } = request.only(['idUser'])
      const user = await db.from('users').where('idUser', idUser).first()
      if (user && user.role === 'apprentices') {
        const newTrainingDiary = await db.table('training_diaries').insert({
          createdAt: new Date(),
        })

        await db
          .from('apprentices')
          .where('id', idUser)
          .update({ idTrainingDiary: newTrainingDiary })

        return response.status(200).json({
          message: 'Training Diary created',
          trainingDiaryId: newTrainingDiary,
        })
      } else {
        return response.status(403).json({
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
