import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apprenticeship_coordinators'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('idApprenticeshipCoordinator').primary()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
