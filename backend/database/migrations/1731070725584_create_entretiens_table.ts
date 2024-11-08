import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'entretiens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idEntretien').primary()
      table
        .integer('dateEntretienKey')
        .unsigned()
        .references('idDateEntretien')
        .inTable('date_entretiens')
        .onDelete('CASCADE')
      table.string('semestre')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
