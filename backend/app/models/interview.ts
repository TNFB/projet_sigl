import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Interview extends BaseModel {
  @column({ isPrimary: true })
  declare idInterview: number

  @column()
  declare semester: number

  @column()
  declare date: DateTime

  @column()
  declare startPeriod: DateTime

  @column()
  declare endPeriod: DateTime
}
