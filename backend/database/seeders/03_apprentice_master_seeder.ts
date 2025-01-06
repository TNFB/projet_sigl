import ApprenticeMaster from '#models/apprentice_master'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await ApprenticeMaster.createMany([
      {
        id: 5,
        idCompany: 1,
      },
      {
        id: 6,
        idCompany: 2,
      },
      {
        id: 7,
        idCompany: 3,
      },
    ])
  }
}
