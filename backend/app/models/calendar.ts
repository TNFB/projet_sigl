import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Calendar extends BaseModel {
  @column({ isPrimary: true })
  declare id_calendar: number

  @column()
  declare id_user: number

  @column()
  declare start_date: DateTime

  @column()
  declare end_date: DateTime

  @column()
  declare title: string

  @column()
  declare type: string

  @column()
  declare color: string
}