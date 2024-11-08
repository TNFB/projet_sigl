import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Document extends BaseModel {
  @column({ isPrimary: true })
  declare idDocument: number

  @column()
  declare nom: string

  @column()
  declare type: string

  @column()
  declare semestre: string

  @column()
  declare status: string
}
