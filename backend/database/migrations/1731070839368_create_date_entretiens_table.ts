import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'date_entretiens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idDateEntretien').primary()
      table.dateTime('entretienDate')
      table.boolean('acceptMA')
      table.boolean('acceptTuteur')
      table.boolean('acceptApprenti')
      table.string('statusDateEntretien')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
