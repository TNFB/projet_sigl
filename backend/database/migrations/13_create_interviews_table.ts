import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'interviews'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_interview').primary()
      table.integer('semester')
      table.dateTime('date')
      table.dateTime('start_period')
      table.dateTime('end_period')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
