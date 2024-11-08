import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'document_evaluations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idDocumentEval')
      table.string('nom')
      table.integer('note')
      table.string('commentaire')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
