import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deadlines'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idDeadline').primary()
      table.string('name')
      table.string('semester')
      table.dateTime('deadlineDate')
      table.string('statusDeadline')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
