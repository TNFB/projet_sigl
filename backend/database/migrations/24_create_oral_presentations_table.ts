import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'oral_presentations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idOralPresentation').primary()
      table.integer('juryKey').unsigned().references('idJury').inTable('juries').onDelete('CASCADE')
      table.dateTime('oralPresentationDate')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
