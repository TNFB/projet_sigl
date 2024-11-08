import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'learning_coordinators'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idCoordinator').primary()
      table.integer('userKey').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('acteurKey')
      table
        .integer('educationCenterKey')
        .unsigned()
        .references('idCentreFormation')
        .inTable('centre_formations')
        .onDelete('CASCADE')
      table.dateTime('startDate')
      table.dateTime('endDate')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
