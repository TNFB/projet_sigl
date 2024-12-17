import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class ApprenticeMastersController {
  /**
   * @method addApprentices
   * @description Ajoute des apprentis à un maître d'apprentissage et met à jour leurs relations.
   *
   * Cette méthode effectue deux opérations principales :
   * 1. Elle ajoute les IDs des nouveaux apprentis à la liste des apprentis du maître dans la table 'apprentice_masters'.
   * 2. Elle met à jour l'ID du maître d'apprentissage pour chaque apprenti dans la table 'apprentices'.
   *
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   * @param {Object} context.request - L'objet de requête contenant les données.
   * @param {Object} context.response - L'objet de réponse pour envoyer le résultat.
   *
   * @property {number} masterId - L'ID du maître d'apprentissage.
   * @property {number[]} apprenticeIds - Un tableau d'IDs des apprentis à ajouter.
   *
   * @throws {NotFound} Si le maître d'apprentissage n'est pas trouvé.
   * @throws {InternalServerError} En cas d'erreur lors du traitement de la requête.
   *
   * @returns {Promise<Object>} Une promesse qui résout avec un objet JSON contenant un message de succès ou d'erreur.
   *
   * @example
   * // Exemple de requête
   * POST /add-apprentices
   * {
   *   "masterId": 1,
   *   "apprenticeIds": [101, 102, 103]
   * }
   *
   * // Exemple de réponse réussie
   * {
   *   "message": "Apprentices added successfully and master updated"
   * }
   */
  async addApprentices({ request, response }: HttpContext) {
    console.log('addApprentices')
    try {
      const { masterId, apprenticeIds } = request.only(['masterId', 'apprenticeIds'])

      // master existe ?
      const master = await db.from('apprentice_masters').where('id', masterId).first()
      if (!master) {
        return response.status(400).json({ message: 'Master not found' })
      }

      // get apprentice list (if existe)
      let currentApprentices = master.listeIdApprentice ? JSON.parse(master.listeIdApprentice) : []

      // add new apprentices ID
      const newApprentices = [...new Set([...currentApprentices, ...apprenticeIds])]

      // Start Transaction
      await db.transaction(async (trx) => {
        // Update apprentice_masters
        await trx
          .from('apprentice_masters')
          .where('id', masterId)
          .update({ listeIdApprentice: JSON.stringify(newApprentices) })

        // Update table apprentices for each apprentice
        for (const apprenticeId of apprenticeIds) {
          await trx
            .from('apprentices')
            .where('id', apprenticeId)
            .update({ idApprenticeMaster: masterId })
        }
      })

      return response.status(200).json({ message: 'Apprentices added successfully' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'An error occurred while adding apprentices' })
    }
  }
}
