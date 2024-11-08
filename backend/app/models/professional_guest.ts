import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ProfesionalGuest extends BaseModel {
  @column({ isPrimary: true })
  declare idProfesionalGuest: number

  @column()
  declare compagnyKey: number

  @column()
  declare numberJury: number
}
