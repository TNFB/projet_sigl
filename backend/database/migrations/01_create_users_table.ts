import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idUser').primary()
      table.string('email').unique()
      table.string('password')
      table.string('name')
      table.string('lastName')
      table.string('telephone')
      table.string('role')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
