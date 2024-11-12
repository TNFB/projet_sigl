import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Jury extends BaseModel {
  @column({ isPrimary: true })
  declare idJury: number

  @column()
  declare presidentKey: number
}
