import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tutoral_teams'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idTutoralTeam').primary()
      table
        .integer('apprenticeKey')
        .unsigned()
        .references('idApprentice')
        .inTable('apprentices')
        .onDelete('CASCADE')
      table
        .integer('apprenticeshipMasterKey')
        .unsigned()
        .references('idMaster')
        .inTable('apprenticeship_masters')
        .onDelete('CASCADE')
      table
        .integer('tutorKey')
        .unsigned()
        .references('idTutor')
        .inTable('educational_tutors')
        .onDelete('CASCADE')
      table.dateTime('startDate')
      table.dateTime('endDate')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
