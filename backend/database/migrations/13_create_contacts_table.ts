import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contacts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('promoKey')
        .primary()
        .unsigned()
        .references('idPromotion')
        .inTable('promotions')
        .onDelete('CASCADE')
        .primary()
      table.integer('learningCoordinatorKey').primary()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
