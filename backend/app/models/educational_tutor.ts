import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class EducationalTutor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
}
