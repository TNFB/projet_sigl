import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Promo extends BaseModel {
  @column({ isPrimary: true })
  declare idPromo: number

  @column()
  declare nom: string

  @column()
  declare nombreApprenti: number

  @column()
  declare dateDebut: DateTime

  @column()
  declare dateFin: DateTime
}
