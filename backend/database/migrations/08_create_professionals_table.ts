import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'professionals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('id')
        .primary()
        .unsigned()
        .references('id_user')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('idCompany')
        .unsigned()
        .references('idCompany')
        .inTable('companies')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
