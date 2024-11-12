import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class CursusManager extends BaseModel {
  @column({ isPrimary: true })
  declare idCursusManager: number

  @column()
  declare userKey: number

  @column()
  declare EducationCenterKey: number

  @column.date()
  declare staetDate: DateTime

  @column.date()
  declare endDate: DateTime
}
