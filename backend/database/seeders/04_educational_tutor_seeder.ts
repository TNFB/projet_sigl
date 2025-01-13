import EducationalTutor from '#models/educational_tutor'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await EducationalTutor.createMany([
      {
        id: 3
      }
    ])
  }
}
