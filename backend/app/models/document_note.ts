import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class DocumentNote extends BaseModel {
  @column({ isPrimary: true })
  declare idDocumentNote: number

  @column()
  declare note: number

  @column()
  declare commentaire: string
}
