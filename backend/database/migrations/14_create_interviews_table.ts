import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'interviews'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idInterview').primary()
      table.integer('semester')
      table.dateTime('date')
      table.dateTime('startPeriod')
      table.dateTime('endPeriod')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
