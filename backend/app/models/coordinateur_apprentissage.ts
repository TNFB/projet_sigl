import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class CoordinateurApprentissage extends BaseModel {
  @column({ isPrimary: true })
  declare idCoordinateur: number

  @column()
  declare acteurKey: number

  @column()
  declare centreFormationKey: number

  @column.date()
  declare dateDebut: DateTime

  @column.date()
  declare dateFin: DateTime
}
