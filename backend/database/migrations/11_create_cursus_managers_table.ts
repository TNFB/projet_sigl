import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cursus_managers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idCursusManager').primary()
      table.integer('userKey').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('EducationCenterKey')
        .unsigned()
        .references('idCentreFormation')
        .inTable('centre_formations')
        .onDelete('CASCADE')

      table.dateTime('staetDate')
      table.dateTime('endDate')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
