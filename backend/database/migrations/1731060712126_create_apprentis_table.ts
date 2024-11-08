import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apprentis'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idApprenti').primary()
      table.integer('acteurKey').unsigned().references('id').inTable('acteur').onDelete('CASCADE')
      table
        .integer('entrepriseActuelleKey')
        .unsigned()
        .references('idEntreprise')
        .inTable('entreprises')
        .onDelete('CASCADE')
      table.string('specialite')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
