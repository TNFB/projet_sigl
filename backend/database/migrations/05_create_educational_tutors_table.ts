import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'educational_tutors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').primary()
      table.json('listeIdApprentice')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
