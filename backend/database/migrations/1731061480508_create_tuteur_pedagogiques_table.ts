import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tuteur_pedagogiques'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('idTuteur')
      table.integer('acteurKey')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
