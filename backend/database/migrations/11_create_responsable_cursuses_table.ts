import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'responsable_cursuses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idResponsable').primary()
      table.integer('acteurKey').unsigned().references('id').inTable('acteurs').onDelete('CASCADE')
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
