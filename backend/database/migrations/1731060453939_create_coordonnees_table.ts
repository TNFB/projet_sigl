import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'coordonnees'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('promoKey')
        .unsigned()
        .references('idPromo')
        .inTable('promos')
        .onDelete('CASCADE')
      table.integer('coordinateurApprentissageKey')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
