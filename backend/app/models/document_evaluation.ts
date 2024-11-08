import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class DocumentEvaluation extends BaseModel {
  @column({ isPrimary: true })
  declare idDocumentEval: number

  @column()
  declare nom: string

  @column()
  declare note: number

  @column()
  declare commentaire: string
}
