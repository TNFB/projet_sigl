import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'entretiens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idEntretien')
      table.integer('dateEntretienKey')
      table.string('semestre')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
