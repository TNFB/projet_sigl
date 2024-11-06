import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Apprenti extends BaseModel {
  @column({ isPrimary: true })
  declare id_apprenti: number

  @column()
  declare acteur_key: number

  @column()
  declare entreprise_actuelle_key: number

  @column()
  declare specialite: string
}
