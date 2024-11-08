import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'educational_rutors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idTutor').primary()
      table.integer('userKey').unsigned().references('id').inTable('users').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
