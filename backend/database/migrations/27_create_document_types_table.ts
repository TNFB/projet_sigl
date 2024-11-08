import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'document_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('typeDocument').primary()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
