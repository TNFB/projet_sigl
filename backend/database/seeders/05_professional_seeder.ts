import Professional from '#models/professional'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Professional.createMany([
      {
        id: 11,
        id_company: 1,
      },
      {
        id: 12,
        id_company: 2,
      },
      {
        id: 13,
        id_company: 3,
      },
    ])
  }
}
