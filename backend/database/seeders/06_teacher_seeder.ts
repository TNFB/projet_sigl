import Teachers from '#models/teachers'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Teachers.createMany([
      {
        id: 14,
      },
      {
        id: 15,
      },
    ])
  }
}