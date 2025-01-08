import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_document').primary()
      table.string('name')
      table.string('document_path')
      table.timestamp('uploaded_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
