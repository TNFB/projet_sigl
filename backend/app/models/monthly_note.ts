import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class MonthluNote extends BaseModel {
  @column({ isPrimary: true })
  declare idMonthlyNote: number

  @column()
  declare idtraningDiary: number

  @column()
  declare creationDate: DateTime

  @column()
  declare title: string

  @column()
  declare content: string
}
