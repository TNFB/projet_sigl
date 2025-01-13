import ApprenticeMaster from '#models/apprentice_master'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await ApprenticeMaster.createMany([
      {
        id: 2,
        id_company: 1,
      },
    ])
  }
}
