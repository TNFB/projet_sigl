import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admins'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('idAdmin').primary()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
