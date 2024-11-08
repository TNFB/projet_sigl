import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Apprentice extends BaseModel {
  @column({ isPrimary: true })
  declare idApprentice: number

  @column()
  declare userKey: number

  @column()
  declare currentCompagnyKey: number

  @column()
  declare specialty: string
}
