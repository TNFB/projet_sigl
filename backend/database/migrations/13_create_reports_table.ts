import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reports'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_report').primary()
      table.string('link_report')
      table.dateTime('deadline')
      table.integer('id_jury')
      table.double('grade')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
