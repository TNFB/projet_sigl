import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Compagny extends BaseModel {
  @column({ isPrimary: true })
  declare idCompagny: number

  @column()
  declare name: string

  @column()
  declare address: string

  @column()
  declare city: string

  @column()
  declare country: string

  @column()
  declare yearOfCollaboration: number

  @column()
  declare field: string

  @column()
  declare description: string

  @column()
  declare numberOfApprentice: number
}
