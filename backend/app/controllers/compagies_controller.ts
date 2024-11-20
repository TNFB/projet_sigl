import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class CompaniesController {
  /**
   * @method create
   * @description Crée une nouvelle compagnie dans la base de données.
   *
   * Cette méthode prend le nom de la compagnie à partir de la requête
   * et l'insère dans la table 'companies'.
   *
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   * @param {Object} context.request - L'objet de requête contenant les données.
   * @param {Object} context.response - L'objet de réponse pour envoyer le résultat.
   *
   * @property {string} name - Le nom de la compagnie à créer.
   *
   * @throws {BadRequest} Si le nom de la compagnie n'est pas fourni.
   * @throws {InternalServerError} En cas d'erreur lors de la création de la compagnie.
   *
   * @returns {Promise<Object>} Une promesse qui résout avec un objet JSON contenant les détails de la compagnie créée.
   *
   * @example
   * // Exemple de requête
   * POST /companies
   * {
   *   "name": "Acme Corporation"
   * }
   *
   * // Exemple de réponse réussie
   * {
   *   "idCompany": 1,
   *   "name": "Acme Corporation",
   *   "message": "Company created successfully"
   * }
   */
  public async create({ request, response }: HttpContext) {
    try {
      const { name } = request.only(['name'])

      // Check if name existe
      if (!name) {
        return response.status(400).json({ message: 'Company name is required' })
      }

      // Add new Compagny
      const [idCompany] = await db.table('companies').insert({ name }).returning('idCompany')

      // Create response
      const company = await db.from('companies').where('idCompany', idCompany).first()

      return response.status(201).json({
        ...company,
        message: 'Company created successfully',
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'An error occurred while creating the company' })
    }
  }
}
