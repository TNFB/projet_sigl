import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apprentices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idApprentice').primary()
      table.integer('userKey').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('currentCompagnyKey')
        .unsigned()
        .references('idEntreprise')
        .inTable('entreprises')
        .onDelete('CASCADE')
      table.string('specialty')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
