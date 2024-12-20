import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_company').primary()
      table.string('name').unique()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
