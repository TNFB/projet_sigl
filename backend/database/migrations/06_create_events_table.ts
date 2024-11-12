import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idEvent').primary()
      table.string('name')
      table.dateTime('startDate')
      table.dateTime('endDate')
      table.string('type')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
