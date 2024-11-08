import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'soutenances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idSoutenance').primary()
      table.integer('juryKey').unsigned().references('idJury').inTable('juries').onDelete('CASCADE')
      table.dateTime('soutenanceDate')
      table.dateTime('soutenanceHeure')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
