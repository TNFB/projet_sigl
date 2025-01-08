import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cursus'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_cursus').primary()
      table.string('promotion_name')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
