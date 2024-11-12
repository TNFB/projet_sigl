import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apprenticeship_masters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idMaster').primary()
      table.integer('userKey').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('currentCompagnyKey')
        .unsigned()
        .references('idCompagny')
        .inTable('compagnies')
        .onDelete('CASCADE')
      table.string('position')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
