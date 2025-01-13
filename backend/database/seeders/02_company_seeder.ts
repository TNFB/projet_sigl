import Company from '#models/company'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Company.createMany([
      {
        name: 'Tom Company',
      },
    ])
  }
}
