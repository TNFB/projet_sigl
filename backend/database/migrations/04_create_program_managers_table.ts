import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'program_managers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').primary()
      table.json('listIdCursus')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
