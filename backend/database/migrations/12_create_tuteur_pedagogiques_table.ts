import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tuteur_pedagogiques'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idTuteur').primary()
      table.integer('acteurKey').unsigned().references('id').inTable('acteurs').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
