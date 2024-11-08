import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Professeur extends BaseModel {
  @column({ isPrimary: true })
  declare idProf: number

  @column()
  declare acteurKey: number

  @column()
  declare centreFormationKey: number

  @column()
  declare specialite: string

  @column()
  declare isEnseignantChercheur: boolean

  @column.date()
  declare dateDebut: DateTime

  @column.date()
  declare dateFin: DateTime
}
