import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CompanyRepresentative extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
}
