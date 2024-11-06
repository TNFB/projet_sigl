import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Professeur extends BaseModel {
  @column({ isPrimary: true })
  declare id_prof: number

  @column()
  declare acteur_key: number

  @column()
  declare centre_formation_key: number

  @column()
  declare specialite: string

  @column()
  declare isEnseignantChercheur: boolean

  @column.date()
  declare date_debut: DateTime

  @column.date()
  declare date_fin: DateTime
}
