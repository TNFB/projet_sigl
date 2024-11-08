import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apprentis'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idApprenti')
      table.integer('acteyrKey')
      table.integer('entrepriseActuelleKey')
      table.string('specialite')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
