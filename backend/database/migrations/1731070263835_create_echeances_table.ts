import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'echeances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idEcheance')
      table.string('nom')
      table.string('semestre')
      table.dateTime('dateEcheance')
      table.string('statuEcheance')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
