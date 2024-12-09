import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apprentice_masters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').primary().references('idUser').inTable('users').onDelete('CASCADE')
      table.json('listeIdApprentice')
      table.integer('idCompagny').references('idCompagny').inTable('compagies').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
