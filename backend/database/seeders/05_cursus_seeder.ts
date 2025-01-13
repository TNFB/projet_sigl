import Cursus from '#models/cursus'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Cursus.createMany([
      {
        promotion_name: 'PointAuCarre'
      }
    ])
  }
}