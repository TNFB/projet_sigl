import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  declare id_company: number

  @column()
  declare name: string
}
