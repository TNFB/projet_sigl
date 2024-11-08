import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'equipe_tutorals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idEquipeTutoral').primary()
      table
        .integer('apprentiKey')
        .unsigned()
        .references('idApprenti')
        .inTable('apprentis')
        .onDelete('CASCADE')
      table
        .integer('maitreApprentissageKey')
        .unsigned()
        .references('idMaitre')
        .inTable('maitre_apprentissages')
        .onDelete('CASCADE')
      table
        .integer('tuteurKey')
        .unsigned()
        .references('idTuteur')
        .inTable('tuteur_pedagogiques')
        .onDelete('CASCADE')
      table.dateTime('dateDebut')
      table.dateTime('dateFin')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
