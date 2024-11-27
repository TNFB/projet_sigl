import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apprentice_masters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').primary()
      table.json('listeIdApprentice')
      table.integer('idCompagny')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
