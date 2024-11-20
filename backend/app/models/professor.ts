import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Professor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
}
