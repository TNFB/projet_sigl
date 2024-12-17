import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class EducationalTutorsController {
  /**
   * @method addApprentices
   * @description Ajoute une liste d'apprentis à un tuteur éducatif.
   *
   * Cette méthode met à jour le champ JSON `listeIdApprentice` dans la table `educational_tutors`
   * pour inclure les apprentis spécifiés. Elle met également à jour la table `apprentices`
   * pour associer chaque apprenti au tuteur éducatif.
   *
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   * @param {Object} context.request - L'objet de requête contenant les données.
   * @param {Object} context.response - L'objet de réponse pour envoyer le résultat.
   *
   * @property {number} tutorId - L'ID du tuteur éducatif.
   * @property {number[]} apprenticeIds - Un tableau contenant les IDs des apprentis à ajouter.
   *
   * @throws {NotFound} Si le tuteur éducatif n'est pas trouvé.
   * @throws {InternalServerError} En cas d'erreur lors de l'ajout des apprentis.
   *
   * @returns {Promise<Object>} Une promesse qui résout avec un objet JSON contenant un message de succès.
   *
   * @example
   * // Exemple de requête
   * POST /educational-tutors/add-apprentices
   * {
   *   "tutorId": 1,
   *   "apprenticeIds": [3, 4, 5]
   * }
   *
   * // Exemple de réponse réussie
   * {
   *   "message": "Apprentices added successfully"
   * }
   *
   * // Exemple de réponse en cas de tuteur non trouvé
   * {
   *   "message": "educational tutors not found"
   * }
   *
   * // Exemple de réponse en cas d'erreur interne
   * {
   *   "message": "An error occurred while adding apprentices"
   * }
   */

  async addApprentices({ request, response }: HttpContext) {
    console.log('addApprentices')
    try {
      const { tutorId, apprenticeIds } = request.only(['tutorId', 'apprenticeIds'])

      // master existe ?
      const master = await db.from('educational_tutors').where('id', tutorId).first()
      if (!master) {
        return response.status(400).json({ message: 'educational tutors not found' })
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

  /**
   * @method assignEducationalTutorRole
   * @description Attribue le rôle "educational_tutor" à un utilisateur existant et l'ajoute à la table educational_tutors.
   *
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   * @param {Object} context.request - L'objet de requête contenant les données.
   * @param {Object} context.response - L'objet de réponse pour envoyer le résultat.
   *
   * @throws {BadRequest} Si l'email n'est pas fourni.
   * @throws {NotFound} Si l'utilisateur n'est pas trouvé.
   * @throws {InternalServerError} En cas d'erreur lors de l'attribution du rôle.
   *
   * @returns {Promise<Object>} Une promesse qui résout avec un objet JSON contenant le résultat de l'opération.
   */
  public async assignEducationalTutorRole({ request, response }: HttpContext) {
    try {
      const { email } = request.only(['email'])

      if (!email) {
        return response.status(400).json({ message: 'Email is required' })
      }

      // Trouver l'utilisateur par email
      const user = await db.from('users').where('email', email).first()

      if (!user) {
        return response.status(400).json({ message: 'User not found' })
      }

      // Commencer une transaction
      await db.transaction(async (trx) => {
        // Mettre à jour le rôle de l'utilisateur
        await trx.from('users').where('idUser', user.idUser).update({ role: 'educational_tutor' })

        // Insérer l'ID de l'utilisateur dans la table educational_tutors
        await trx.table('educational_tutors').insert({ id: user.idUser })
      })

      return response.status(200).json({
        message: 'User successfully assigned as educational tutor',
        userId: user.idUser,
      })
    } catch (error) {
      console.error(error)
      return response
        .status(500)
        .json({ message: 'An error occurred while assigning educational tutor role' })
    }
  }
}
