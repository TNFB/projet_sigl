import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'professeurs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idProf')
      table.integer('acteurKey')
      table.integer('centreFormationKey')
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
