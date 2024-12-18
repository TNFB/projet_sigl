import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'oral_presentations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idOralPresentation').primary()
      table.string('linkOralPresentation')
      table.dateTime('deadline')
      table.integer('idJury')
      table.integer('idPresident')
      table.dateTime('presentationDate')
      table.double('grade')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
