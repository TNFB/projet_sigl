import { HttpContext } from '@adonisjs/core/http'
import Database from '@adonisjs/lucid/services/db'

export default class DepositsController {
  public async getAllDeposits({ response }: HttpContext) {
    try {
      const deposits = await Database.from('deposits').select('*')
      return response.json(deposits)
    } catch (error) {
      return response.status(500).json({ error: 'Erreur in get Depots' })
    }
  }

  public async addDeposit({ request, response }: HttpContext) {
    try {
      const { deposit } = request.only(['deposit'])

      const newDeposit = await Database.table('deposits').insert({ deposit }).returning('deposit')
      return response.status(201).json(newDeposit[0])
    } catch (error) {
      return response.status(500).json({ error: 'Error Add Deposit' })
    }
  }

  public async deleteDeposit({ params, response }: HttpContext) {
    try {
      const { deposit } = params
      const deletedCount = await Database.from('deposits').where('deposit', deposit).delete()

      if (deletedCount[0] === 0) {
        return response.status(404).json({ message: 'depot Not found' })
      }

      return response.status(200).json({ message: 'depos deleted successfully' })
    } catch (error) {
      return response.status(500).json({ error: 'Error in delete Deposit' })
    }
  }
}
