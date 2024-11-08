import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'maitre_apprentissages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('idMaitre')
      table.integer('acteurKey')
      table.integer('entrepriseActuelleKey')
      table.string('poste')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
