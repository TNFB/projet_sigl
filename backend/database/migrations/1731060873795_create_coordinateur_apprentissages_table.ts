import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'coordinateur_apprentissages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .increments('idCoordinateur')
        .unsigned()
        .references('id')
        .inTable('acteur')
        .onDelete('CASCADE')
      table.integer('acteurKey')
      table
        .integer('centreFormationKey')
        .unsigned()
        .references('idCentreFormation')
        .inTable('centre_formations')
        .onDelete('CASCADE')
      table.dateTime('dateDebut')
      table.dateTime('dateFin')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
