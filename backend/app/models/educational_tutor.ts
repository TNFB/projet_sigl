import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class EducationalTutor extends BaseModel {
  @column({ isPrimary: true })
  declare idTutor: number

  @column()
  declare userKey: number
}
