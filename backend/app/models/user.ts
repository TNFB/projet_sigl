import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class User extends BaseModel {

  @column({ isPrimary: true })
  declare id_user: number

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare name: string

  @column()
  declare last_name: string

  @column()
  declare telephone: string

  @column()
  declare role: string
}
