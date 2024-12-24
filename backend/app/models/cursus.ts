import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Cursus extends BaseModel {
  @column({ isPrimary: true })
  declare id_cursus: number

  @column()
  declare promotion_name: string

  @column()
  declare start_promotion_year: DateTime

  @column()
  declare end_promotion_year: DateTime
}
