import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'monthly_notes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .increments('idTraningDiary')
        .primary()
        .unsigned()
        .references('idTrainingDiary')
        .inTable('training_diaries')
        .onDelete('CASCADE')
      table.dateTime('creationDate')
      table.string('title')
      table.text('content', 'longtext')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
