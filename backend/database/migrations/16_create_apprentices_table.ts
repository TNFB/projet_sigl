import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apprentices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('id')
        .primary()
        .unsigned()
        .references('id_user')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('id_educational_tutor')
        .unsigned()
        .references('id')
        .inTable('educational_tutors')
        .onDelete('CASCADE')
      table
        .integer('id_apprentice_master')
        .unsigned()
        .references('id')
        .inTable('apprentice_masters')
        .onDelete('CASCADE')
      table
        .integer('id_cursus')
        .unsigned()
        .references('id_cursus')
        .inTable('cursus')
        .onDelete('CASCADE')
      table
        .integer('id_training_diary')
        .unsigned()
        .references('id_training_diary')
        .inTable('training_diaries')
        .onDelete('CASCADE')
      table
        .integer('id_company')
        .unsigned()
        .references('id_company')
        .inTable('companies')
        .onDelete('CASCADE')
      table.json('list_missions')
      table.json('list_skills')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
