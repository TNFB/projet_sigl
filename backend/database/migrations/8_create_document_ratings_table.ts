import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'document_ratings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idDocumentRating').primary()
      table.integer('rating')
      table.string('comment')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
