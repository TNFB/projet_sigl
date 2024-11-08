import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'responsable_cursuses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idResponsable')
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
