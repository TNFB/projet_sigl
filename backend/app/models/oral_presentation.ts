import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class OralPresentation extends BaseModel {
  @column({ isPrimary: true })
  declare idOralPresentation: number

  @column()
  declare juryKey: number

  @column()
  declare oralPresentationDate: DateTime
}
