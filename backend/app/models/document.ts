import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Document extends BaseModel {
  @column({ isPrimary: true })
  declare idDocument: number

  @column()
  declare documentLink: string

  @column()
  declare dropDate: DateTime
}
