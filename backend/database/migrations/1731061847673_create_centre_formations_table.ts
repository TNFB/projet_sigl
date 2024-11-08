import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'centre_formations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idCentreFormation')
      table.string('nom')
      table.string('prenom')
      table.string('ville')
      table.string('pays')
      table.integer('anneeFormation')
      table.integer('nombreEtudiant')
      table.string('description')
      table.string('domaine')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
