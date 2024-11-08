import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reglages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idReglage')
      table.boolean('isNotificationActive')
      table.boolean('isRappelActive')
      table.integer('acteurKey')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
