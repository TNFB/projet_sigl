import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Compagy extends BaseModel {
  @column({ isPrimary: true })
  declare idCompagny: number

  @column()
  declare name: string
}
