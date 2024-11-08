import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'equipe_tutorals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idEquipeTutoral')
      table.integer('apprentiKey')
      table.integer('maitreApprentissageKey')
      table.integer('tuteurKey')
      table.dateTime('dateDebut')
      table.dateTime('dateFin')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
