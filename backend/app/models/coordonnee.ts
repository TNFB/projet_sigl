import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Coordonnee extends BaseModel {
  @column({ isPrimary: true })
  declare promo_key: number

  @column({ isPrimary: true })
  declare coordinateur_apprentissage_key: number
}
