import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Evenement extends BaseModel {
  @column({ isPrimary: true })
  declare idEvenement: number

  @column()
  declare nom: string

  @column()
  declare dateStart: DateTime

  @column()
  declare dateEnd: DateTime

  @column()
  declare type: string
}
