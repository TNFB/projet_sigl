import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'promotions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idPromotion').primary()
      table.string('name')
      table.integer('numberApprentice')
      table.dateTime('startDate')
      table.dateTime('endDate')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
