import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Document extends BaseModel {
  @column({ isPrimary: true })
  declare id_document: number

  @column()
  declare name: string

  @column()
  declare type: string

  @column()
  declare document_path: string

  @column()
  declare uploaded_at: DateTime
}
