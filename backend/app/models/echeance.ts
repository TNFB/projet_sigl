import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Echeance extends BaseModel {
  @column({ isPrimary: true })
  declare idEcheance: number

  @column()
  declare nom: string

  @column()
  declare semestre: string

  @column()
  declare dateEcheance: DateTime

  @column()
  declare statuEcheance: string
}
