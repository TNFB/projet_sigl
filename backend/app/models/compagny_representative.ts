import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CompagnyRepresentative extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
}
