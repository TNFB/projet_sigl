import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idDocument').primary()
      table.string('name')
      table.string('documentPath')
      table.timestamp('uploadedAt', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
