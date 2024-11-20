import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Cursus extends BaseModel {
  @column({ isPrimary: true })
  declare idCursus: number

  @column()
  declare promotionName: string

  @column()
  declare startPromotionYear: DateTime

  @column()
  declare endPromotionYear: DateTime
}
