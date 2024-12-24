import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class OralPresentation extends BaseModel {
  @column({ isPrimary: true })
  declare id_oral_presentation: number

  @column()
  declare link_oral_presentation: string

  @column()
  declare deadline: DateTime

  @column()
  declare id_jury: number

  @column()
  declare id_president: number

  @column()
  declare presentation_date: DateTime

  @column()
  declare grade: number
}
