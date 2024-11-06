import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class MaitreApprentissage extends BaseModel {
  @column({ isPrimary: true })
  declare id_maitre: number

  @column()
  declare acteur_key: number

  @column()
  declare entreprise_actuelle_key: number

  @column()
  declare poste: string
}
