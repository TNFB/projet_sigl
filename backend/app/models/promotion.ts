import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Promotion extends BaseModel {
  @column({ isPrimary: true })
  declare idPromotion: number

  @column()
  declare name: string

  @column()
  declare numberApprentice: number

  @column()
  declare startDate: DateTime

  @column()
  declare endDate: DateTime
}
