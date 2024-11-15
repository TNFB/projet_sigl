import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ApprenticeMaster extends BaseModel {
  @column({ isPrimary: true })
  declare idApprenticeMaster: number

  @column()
  declare listeIdApprentice: JSON
}
