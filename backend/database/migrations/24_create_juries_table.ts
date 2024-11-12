import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'juries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idJury').primary()
      table
        .integer('presidentKey')
        .unsigned()
        .references('idProfessor')
        .inTable('professors')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
