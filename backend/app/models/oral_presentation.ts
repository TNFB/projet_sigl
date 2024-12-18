import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class OralPresentation extends BaseModel {
  @column({ isPrimary: true })
  declare idOralPresentation: number

  @column()
  declare linkOralPresentation: string

  @column()
  declare deadline: DateTime

  @column()
  declare idJury: number

  @column()
  declare idPresident: number

  @column()
  declare presentationDate: DateTime

  @column()
  declare grade: number
}
