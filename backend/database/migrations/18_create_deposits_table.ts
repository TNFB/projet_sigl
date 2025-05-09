import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deposits'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('deposit').unique()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
