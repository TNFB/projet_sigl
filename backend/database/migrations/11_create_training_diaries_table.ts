import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'training_diaries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idTrainingDiary').primary()
      table.json('semesterGrades')
      table.json('documentList')
      table.integer('evaluation')
      table.json('listInterview')
      table.json('listReport')
      table.json('listPresentation')
      table.timestamp('createdAt', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
