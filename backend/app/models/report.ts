import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Report extends BaseModel {
  @column({ isPrimary: true })
  declare id_report: number

  @column()
  declare link_report: string

  @column()
  declare deadline: DateTime

  @column()
  declare id_jury: number

  @column()
  declare grade: number
}
