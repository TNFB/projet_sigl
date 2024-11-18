import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idDocument').primary()
      table.string('documentLink')
      table.dateTime('dropDate')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
