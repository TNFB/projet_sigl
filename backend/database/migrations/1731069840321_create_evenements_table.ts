import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'evenements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idEvenement')
      table.string('nom')
      table.dateTime('dateStart')
      table.dateTime('dateEnd')
      table.string('type')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
