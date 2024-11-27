import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ApprenticeMaster extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare listeIdApprentice: JSON

  @column()
  declare idCompagny: number
}
