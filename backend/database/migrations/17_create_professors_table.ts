import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'professors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idProfessor').primary()
      table.integer('userKey').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('educationCenterKey')
        .unsigned()
        .references('idEducationCenter')
        .inTable('education_centers')
        .onDelete('CASCADE')
      table.string('specialty')
      table.boolean('isResearchTeacher')
      table.datetime('startDate')
      table.datetime('endDate')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
