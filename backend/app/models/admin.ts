import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Admin extends BaseModel {
  @column({ isPrimary: true })
  declare idAdmin: number

  @column()
  declare acteurKey: number
}
