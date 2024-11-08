import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profesional_guests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idProfesionalGuest').primary()
      table
        .integer('compagnyKey')
        .unsigned()
        .references('idCompagny')
        .inTable('compagnies')
        .onDelete('CASCADE')
      table.integer('numberJury')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
