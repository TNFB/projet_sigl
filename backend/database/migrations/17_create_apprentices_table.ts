import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apprentices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('id')
        .primary()
        .unsigned()
        .references('idUser')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('idEducationalTutor')
        .unsigned()
        .references('id')
        .inTable('educational_tutors')
        .onDelete('CASCADE')
      table
        .integer('idApprenticeMaster')
        .unsigned()
        .references('id')
        .inTable('apprentice_masters')
        .onDelete('CASCADE')
      table
        .integer('idCursus')
        .unsigned()
        .references('idCursus')
        .inTable('cursus')
        .onDelete('CASCADE')
      table
        .integer('idTrainingDiary')
        .unsigned()
        .references('idTrainingDiary')
        .inTable('training_diaries')
        .onDelete('CASCADE')
      table
        .integer('idCompagny')
        .unsigned()
        .references('idCompagny')
        .inTable('compagies')
        .onDelete('CASCADE')
      table.json('listMissions')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
