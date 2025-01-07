import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'program_managers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('id')
        .primary()
        .unsigned()
        .references('id_user')
        .inTable('users')
        .onDelete('CASCADE')
      table.json('list_id_cursus')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
