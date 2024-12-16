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
  public async createCompany({ request, response }: HttpContext) {
    try {
      const { name } = request.only(['name'])

      // Check if name existe
      if (!name) {
        return response.status(400).json({ message: 'Company name is required' })
      }

      // Vérifier si une compagnie avec ce nom existe déjà
      const existingCompany = await db.from('compagies').where('name', name).first()
      if (existingCompany) {
        return response.status(409).json({ message: 'A company with this name already exists' })
      }

      // Add new Compagny
      const [idCompagny] = await db.table('compagies').insert({ name }).returning('idCompagny')

      // Create response
      const company = await db.from('compagies').where('idCompagny', idCompagny).first()

      return response.status(201).json({
        ...company,
        message: 'Company created successfully',
      })
    } catch (error) {
      console.error(error)
      if (error.code === 'ER_DUP_ENTRY') {
        return response.status(409).json({ message: 'A company with this name already exists' })
      }
      return response.status(500).json({ message: 'An error occurred while creating the company' })
    }
  }

  /**
   * @method getAllCompanyNames
   * @description Récupère tous les noms de compagnies de la base de données.
   *
   * Cette méthode interroge la table 'companies' et renvoie une liste de tous les noms de compagnies.
   *
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   * @param {Object} context.response - L'objet de réponse pour envoyer le résultat.
   *
   * @throws {NotFound} Si aucune compagnie n'est trouvée.
   * @throws {InternalServerError} En cas d'erreur lors de la récupération des compagnies.
   *
   * @returns {Promise<Object>} Une promesse qui résout avec un objet JSON contenant la liste des noms de compagnies.
   *
   * @example
   * // Exemple de requête
   * GET /companies/names
   *
   * // Exemple de réponse réussie
   * {
   *   "companyNames": ["Acme Corporation", "Globex Corporation", "Soylent Corp"]
   * }
   */
  public async getAllCompanyNames({ response }: HttpContext) {
    try {
      // Récupérer tous les noms de compagnies
      const compagies = await db.from('compagies').select('name')

      // Vérifier si des compagnies ont été trouvées
      if (compagies.length === 0) {
        return response.status(404).json({ message: 'No compagies found' })
      }

      // Extraire uniquement les noms
      const companyNames = compagies.map((company) => company.name)

      return response.status(200).json({
        companyNames: companyNames,
      })
    } catch (error) {
      console.error(error)
      return response
        .status(500)
        .json({ message: 'An error occurred while retrieving company names' })
    }
  }
}
