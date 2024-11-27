import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cursuses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idCursus').primary()
      table.string('promotionName')
      table.dateTime('startPromotionYear')
      table.dateTime('endPromotionYear')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
