import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class DocumentType extends BaseModel {
  @column({ isPrimary: true })
  declare DocumentType: string
}
