import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rappels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idRappel')
      table.string('nom')
      table.integer('delay')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
