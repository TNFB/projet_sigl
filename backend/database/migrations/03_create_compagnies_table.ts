import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'compagnies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idCompagny').primary()
      table.string('name')
      table.string('address')
      table.string('city')
      table.string('country')
      table.integer('yearOfCollaboration')
      table.string('field')
      table.string('description')
      table.integer('numberOfApprentice')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
