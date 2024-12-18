import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare idUser: number

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare name: string

  @column()
  declare lastName: string

  @column()
  declare telephone: string

  @column()
  declare role: string
}
