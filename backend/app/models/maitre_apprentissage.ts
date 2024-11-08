import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class MaitreApprentissage extends BaseModel {
  @column({ isPrimary: true })
  declare idMaitre: number

  @column()
  declare acteurKey: number

  @column()
  declare entrepriseActuelleKey: number

  @column()
  declare poste: string
}
