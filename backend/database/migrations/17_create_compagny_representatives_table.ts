import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'compagny_representatives'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').primary()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
