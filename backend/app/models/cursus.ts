import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Cursus extends BaseModel {
  @column({ isPrimary: true })
  declare id_cursus: number

  @column()
  declare promotion_name: string
}
