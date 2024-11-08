import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tutoral_teams'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idTutoralTeam').primary()
      table
        .integer('apprenticeKey')
        .unsigned()
        .references('idApprenti')
        .inTable('apprentis')
        .onDelete('CASCADE')
      table
        .integer('apprenticeshipMasterKey')
        .unsigned()
        .references('idMaitre')
        .inTable('maitre_apprentissages')
        .onDelete('CASCADE')
      table
        .integer('tutorKey')
        .unsigned()
        .references('idTuteur')
        .inTable('tuteur_pedagogiques')
        .onDelete('CASCADE')
      table.dateTime('startDate')
      table.dateTime('endDate')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
