import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Acteur extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nom: string

  @column()
  declare prenom: string

  @column.date()
  declare dateNaissance: DateTime

  @column()
  declare genre: string

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare telephone: string

  @column()
  declare actif: boolean
}
