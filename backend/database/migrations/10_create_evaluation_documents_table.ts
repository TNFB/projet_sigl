import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'evaluation_documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idEvaluationDocument').primary()
      table.string('name')
      table.integer('rating')
      table.string('comment')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
