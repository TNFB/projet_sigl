import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'monthly_notes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_monthly_note')
      table
        .integer('id_traning_diary')
        .primary()
        .unsigned()
        .references('id_training_diary')
        .inTable('training_diaries')
        .onDelete('CASCADE')
      table.string('title')
      table.text('content', 'longtext')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
