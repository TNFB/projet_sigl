import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

/**
 * @class CursusController
 * @description Contrôleur pour gérer les opérations liées aux cursus.
 */
export default class CursusController {
  /**
   * @method getAllPromotions
   * @description Récupère toutes les promotions de la table cursus.
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   * @returns {Promise<JSON>} Une réponse JSON contenant toutes les promotions ou une erreur.
   */
  public async getAllPromotions({ response }: HttpContext) {
    try {
      const promotions = await db.from('cursus').select('promotion_name')
      return response.status(200).json({ promotions })
    } catch (error) {
      console.error('Error fetching promotions:', error)
      return response.status(500).json({ error: 'An error occurred while fetching promotions' })
    }
  }
}