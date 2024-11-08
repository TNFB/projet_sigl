import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'coordinateur_apprentissages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idCoordinateur')
      table.integer('acteurKey')
      table.integer('centreFormationKey')
      table.dateTime('dateDebut')
      table.dateTime('dateFin')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
