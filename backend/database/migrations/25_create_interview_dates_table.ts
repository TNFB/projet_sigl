import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'interview_dates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idMaintenanceDate').primary()
      table.dateTime('interviewDate')
      table.boolean('acceptApprenticeshipMaster')
      table.boolean('acceptTutor')
      table.boolean('acceptApprentice')
      table.string('statusInterviewDate')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
