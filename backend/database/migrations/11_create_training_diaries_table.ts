import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'training_diaries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_training_diary').primary()
      table.json('semester_grades')
      table.json('document_list')
      table.integer('evaluation')
      table.json('list_interview')
      table.json('list_report')
      table.json('list_presentation')
      table.timestamp('created_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
