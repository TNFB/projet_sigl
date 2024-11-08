import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Professor extends BaseModel {
  @column({ isPrimary: true })
  declare idProfessor: number

  @column()
  declare userKey: number

  @column()
  declare educationCenterKey: number

  @column()
  declare specialty: string

  @column()
  declare isResearchTeacher: boolean

  @column.date()
  declare startDate: DateTime

  @column.date()
  declare endDate: DateTime
}
