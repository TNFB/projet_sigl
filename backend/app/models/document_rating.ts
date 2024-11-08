import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class DocumentRating extends BaseModel {
  @column({ isPrimary: true })
  declare idDocumentRating: number

  @column()
  declare rating: number

  @column()
  declare comment: string
}
