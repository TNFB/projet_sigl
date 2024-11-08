import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'entreprises'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idEntreprise').primary()
      table.string('nom')
      table.string('adresse')
      table.string('ville')
      table.string('pays')
      table.integer('anneeCollaboration')
      table.string('domaine')
      table.string('description')
      table.integer('nombreApprenti')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
