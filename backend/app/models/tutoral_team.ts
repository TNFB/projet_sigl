import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TutoralTeam extends BaseModel {
  @column({ isPrimary: true })
  declare idTutoralTeam: number

  @column()
  declare apprenticeKey: number

  @column()
  declare apprenticeshipMasterKey: number

  @column()
  declare tutorKey: number

  @column()
  declare startDate: DateTime

  @column()
  declare endDate: DateTime
}
