import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare firstName: string

  @column.date()
  declare dateBirth: DateTime

  @column()
  declare genre: string

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare telephone: string

  @column()
  declare asset: boolean
}
