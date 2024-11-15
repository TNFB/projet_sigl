import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'professionals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('idProfessional').primary()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
