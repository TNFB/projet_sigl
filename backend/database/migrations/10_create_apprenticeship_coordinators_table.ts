import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apprenticeship_coordinators'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('id')
        .primary()
        .unsigned()
        .references('idUser')
        .inTable('users')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
