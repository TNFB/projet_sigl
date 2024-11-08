import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'professeurs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idProf').primary()
      table.integer('acteurKey').unsigned().references('id').inTable('acteurs').onDelete('CASCADE')
      table
        .integer('centreFormationKey')
        .unsigned()
        .references('idCentreFormation')
        .inTable('centre_formations')
        .onDelete('CASCADE')
      table.string('specialite')
      table.boolean('isEnseignantChercheur')
      table.datetime('dateDebut')
      table.datetime('dateFin')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
