import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class EvaluationDocument extends BaseModel {
  @column({ isPrimary: true })
  declare idEvaluationDocument: number

  @column()
  declare name: string

  @column()
  declare rating: number

  @column()
  declare comment: string
}
