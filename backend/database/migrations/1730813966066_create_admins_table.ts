import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admin'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_admin')
      table.integer('acteur_key').unsigned().references('id').inTable('acteur').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
