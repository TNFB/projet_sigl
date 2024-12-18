import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reports'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idReport').primary()
      table.string('linkReport')
      table.dateTime('deadline')
      table.integer('idJury')
      table.double('grade')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
