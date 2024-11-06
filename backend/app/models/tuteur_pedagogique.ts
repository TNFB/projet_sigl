import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TuteurPedagogique extends BaseModel {
  @column({ isPrimary: true })
  declare id_tuteur: number

  @column()
  declare acteur_key: number
}
