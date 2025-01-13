import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Interview extends BaseModel {
  @column({ isPrimary: true })
  declare id_interview: number

  @column()
  declare semester: number

  @column()
  declare date: DateTime

  @column()
  declare start_period: DateTime

  @column()
  declare end_period: DateTime
}
