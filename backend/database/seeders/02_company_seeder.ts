import Company from '#models/company'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Company.createMany([
      {
        name: 'company1',
      },
      {
        name: 'company2',
      },
      {
        name: 'company3',
      },
    ])
  }
}
