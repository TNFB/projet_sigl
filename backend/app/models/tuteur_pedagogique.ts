import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TuteurPedagogique extends BaseModel {
  @column({ isPrimary: true })
  declare idTuteur: number

  @column()
  declare acteurKey: number
}
