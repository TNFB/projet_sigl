import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_event')
      table
        .integer('id_user')
        .unsigned()
        .references('id_user')
        .inTable('users')
        .onDelete('CASCADE')
      table.dateTime('start_date')
      table.dateTime('end_date')
      table.string('title')
      table.string('type')
      table.string('color')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}