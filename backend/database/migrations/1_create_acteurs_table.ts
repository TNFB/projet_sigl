import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'acteurs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nom')
      table.string('prenom')
      table.timestamp('dateNaissance')
      table.string('genre')
      table.string('email').unique()
      table.string('password')
      table.string('telephone')
      table.boolean('actif')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
