import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Document extends BaseModel {
  @column({ isPrimary: true })
  declare id_document: number

  @column()
  declare document_link: string

  @column()
  declare drop_date: DateTime
}
