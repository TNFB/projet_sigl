import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Deposit extends BaseModel {
  @column({ isPrimary: true })
  declare deposit: String
}
