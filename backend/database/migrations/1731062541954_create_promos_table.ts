import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'promos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idPromo')
      table.string('nom')
      table.integer('nombreApprenti')
      table.dateTime('dateDebut')
      table.dateTime('dateFin')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
