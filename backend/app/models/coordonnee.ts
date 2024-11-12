import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Contact extends BaseModel {
  @column({ isPrimary: true })
  declare promoKey: number

  @column({ isPrimary: true })
  declare learningCoordinatorKey: number
}
