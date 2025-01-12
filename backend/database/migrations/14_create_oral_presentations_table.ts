import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'oral_presentations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_oral_presentation').primary()
      table.string('link_oral_presentation')
      table.dateTime('deadline')
      table.integer('id_jury')
      table.integer('id_president')
      table.dateTime('presentation_date')
      table.double('grade')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
