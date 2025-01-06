import Professional from '#models/professional'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Professional.createMany([
      {
        id: 11,
        idCompany: 1,
      },
      {
        id: 12,
        idCompany: 2,
      },
      {
        id: 13,
        idCompany: 3,
      },
    ])
  }
}
