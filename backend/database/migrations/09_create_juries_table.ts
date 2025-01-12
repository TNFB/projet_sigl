import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'juries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_jury').primary()
      table.json('liste_id_jury')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
