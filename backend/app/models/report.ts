import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Report extends BaseModel {
  @column({ isPrimary: true })
  declare idReport: number

  @column()
  declare linkReport: string

  @column()
  declare deadline: DateTime

  @column()
  declare idJury: number

  @column()
  declare grade: number
}
