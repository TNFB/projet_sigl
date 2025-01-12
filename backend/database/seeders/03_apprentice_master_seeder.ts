import ApprenticeMaster from '#models/apprentice_master'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await ApprenticeMaster.createMany([
      {
        id: 5,
        id_company: 1,
      },
      {
        id: 6,
        id_company: 2,
      },
      {
        id: 7,
        id_company: 3,
      },
    ])
  }
}
