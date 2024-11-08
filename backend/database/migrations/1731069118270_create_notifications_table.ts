import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idNotification').primary()
      table.integer('acteurKey').unsigned().references('id').inTable('acteur').onDelete('CASCADE')
      table.string('type')
      table.boolean('isActive')
      table.dateTime('notificationDate')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
