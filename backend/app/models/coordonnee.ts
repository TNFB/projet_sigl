import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Coordonnee extends BaseModel {
  @column({ isPrimary: true })
  declare promoKey: number

  @column({ isPrimary: true })
  declare coordinateurApprentissageKey: number
}
