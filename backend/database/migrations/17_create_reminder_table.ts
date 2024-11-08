import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reminders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idReminder').primary()
      table.string('name')
      table.integer('delay')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
