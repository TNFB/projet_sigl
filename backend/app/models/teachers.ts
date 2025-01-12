import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Teachers extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
}
