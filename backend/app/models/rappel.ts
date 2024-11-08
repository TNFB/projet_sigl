import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Rappel extends BaseModel {
  @column({ isPrimary: true })
  declare idRappel: number

  @column()
  declare nom: string

  @column()
  declare delay: number
}
