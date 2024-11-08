import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class LearningCoordinator extends BaseModel {
  @column({ isPrimary: true })
  declare idCoordinator: number

  @column()
  declare userKey: number

  @column()
  declare educationCenterKey: number

  @column.date()
  declare startDate: DateTime

  @column.date()
  declare endDate: DateTime
}
