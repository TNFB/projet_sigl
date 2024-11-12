import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Deadline extends BaseModel {
  @column({ isPrimary: true })
  declare idDeadline: number

  @column()
  declare name: string

  @column()
  declare semester: string

  @column()
  declare deadlineDate: DateTime

  @column()
  declare statusDeadline: string
}
