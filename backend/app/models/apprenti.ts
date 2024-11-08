import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Apprenti extends BaseModel {
  @column({ isPrimary: true })
  declare idApprenti: number

  @column()
  declare acteurKey: number

  @column()
  declare entrepriseActuelleKey: number

  @column()
  declare specialite: string
}
