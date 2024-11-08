import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class ResponsableCursus extends BaseModel {
  @column({ isPrimary: true })
  declare idResponsable: number

  @column()
  declare acteurKey: number

  @column()
  declare centreFormationKey: number

  @column.date()
  declare dateDebut: DateTime

  @column.date()
  declare dateFin: DateTime
}
