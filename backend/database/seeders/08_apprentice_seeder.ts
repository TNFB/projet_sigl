import Apprentice from '#models/apprentice'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Apprentice.createMany([
      {
        id: 3,
        id_apprentice_master: 2,
        id_company: 1,
        id_cursus: 1
      },
    ])
  }
}