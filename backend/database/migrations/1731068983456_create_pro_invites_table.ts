import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pro_invites'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idProInvite')
      table.integer('entrepriseKey')
      table.integer('nombreJury')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
