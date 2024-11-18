import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apprentices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').primary()
      table.integer('idEducationalTutor')
      table.integer('idApprenticeMaster')
      table.integer('idCursus')
      table.integer('idTrainingDiary')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
