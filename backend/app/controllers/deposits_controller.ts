import { HttpContext } from '@adonisjs/core/http'
import Database from '@adonisjs/lucid/services/db'
import { isValidRole } from '../utils/api_utils.js'

/**
 * @class DepositsController
 * @description Contrôleur pour gérer les opérations CRUD sur les dépôts.
 */
export default class DepositsController {
  /**
   * @method getAllDeposits
   * @description Récupère tous les dépôts de la base de données.
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   * @returns {Promise<JSON>} Une réponse JSON contenant tous les dépôts ou une erreur.
   */
  public async getAllDeposits({ request, response }: HttpContext) {
    try {
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
      const deposits = await Database.from('deposits').select('*')
      return response.json(deposits)
    } catch (error) {
      return response.status(500).json({ error: 'Erreur in get Depots' })
    }
  }

  /**
   * @method addDeposit
   * @description Ajoute un nouveau dépôt à la base de données.
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   * @returns {Promise<JSON>} Une réponse JSON indiquant le succès ou l'échec de l'opération.
   */
  public async addDeposit({ request, response }: HttpContext) {
    try {
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { deposit } = data

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
      const getDeposit = await Database.from('deposits')
        .where('deposit', deposit)
        .count('* as total')
      if (getDeposit[0].total > 0) {
        return response.status(400).json({
          status: 'error',
          message: `deposit: ${deposit} already existe in DB`,
        })
      }
      await Database.table('deposits').insert({ deposit }).returning('deposit')
      return response.status(201).json({
        status: 'success',
        message: 'deposit successfully Added',
      })
    } catch (error) {
      return response.status(500).json({ error: 'Error Add Deposit' })
    }
  }

  /**
   * @method deleteDeposit
   * @description Supprime un dépôt spécifique de la base de données.
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   * @returns {Promise<JSON>} Une réponse JSON indiquant le succès ou l'échec de l'opération.
   */
  public async deleteDeposit({ request, response }: HttpContext) {
    try {
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { deposit } = data

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

      const deletedCount = await Database.from('deposits').where('deposit', deposit).delete()
      if (deletedCount[0] === 0) {
        return response.status(400).json({ message: 'deposit Not found' })
      }

      return response.status(200).json({ message: 'depos deleted successfully' })
    } catch (error) {
      return response.status(500).json({ error: 'Error in delete Deposit' })
    }
  }
}
