import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'interveiws'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idInterveiw').primary()
      table
        .integer('interveiwDateKey')
        .unsigned()
        .references('idMaintenanceDate')
        .inTable('interview_dates')
        .onDelete('CASCADE')
      table.string('semester')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
