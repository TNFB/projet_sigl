import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { isValidRole } from 'app/utils/apiUtils.js'

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
   *   "id_company": 1,
   *   "name": "Acme Corporation",
   *   "message": "Company created successfully"
   * }
   */
  public async createCompany({ request, response }: HttpContext) {
    try {
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { companiesData, token } = data

      const emailUser = request.user.email
      // Vérifier si l'admin existe et si le token est valide
      if (!(await isValidRole(emailUser, 'admins'))) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid role, token, or token has expired',
        })
      }

      if (!Array.isArray(companiesData) || companiesData.length === 0) {
        return response
          .status(400)
          .json({ message: 'Invalid input: data should be a non-empty array of company names' })
      }

      const results = []

      for (const companyData of companiesData) {
        const { name } = companyData

        if (!name) {
          results.push({ name, status: 'error', message: 'Company name is required' })
          continue
        }

        // Vérifier si une compagnie avec ce nom existe déjà
        const existingCompany = await db.from('companies').where('name', name).first()
        if (existingCompany) {
          results.push({
            name,
            status: 'error',
            message: 'A company with this name already exists',
          })
          continue
        }

        // Add new Company
        const [idCompany] = await db.table('companies').insert({ name }).returning('id_company')

        // Create response
        const company = await db.from('companies').where('id_company', idCompany).first()

        results.push({ ...company, status: 'success', message: 'Company created successfully' })
      }

      return response.status(200).json({
        results,
        message: 'Companies processing completed',
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'An error occurred while processing companies' })
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
  public async getAllCompanyNames({ request, response }: HttpContext) {
    try {
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { token } = data

      const emailUser = request.user.email
      // Vérifier si l'admin existe et si le token est valide
      if (!(await isValidRole(emailUser, 'admins'))) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid role, token, or token has expired',
        })
      }

      // Récupérer tous les noms de compagnies
      const companies = await db.from('companies').select('name')

      // Vérifier si des compagnies ont été trouvées
      if (companies.length === 0) {
        return response.status(400).json({ message: 'No companies found' })
      }

      // Extraire uniquement les noms
      const companyNames = companies.map((company) => company.name)

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
