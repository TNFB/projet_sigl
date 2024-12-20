import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_user').primary()
      table.string('email').unique().notNullable()
      table.string('password')
      table.string('name')
      table.string('last_name')
      table.string('telephone')
      table.string('role')
      table.string('token').nullable()
      table.dateTime('expired_date').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
