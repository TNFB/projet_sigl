import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idDocument')
      table.string('nom')
      table.string('type')
      table.string('semestre')
      table.string('status')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
