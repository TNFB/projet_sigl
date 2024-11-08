import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class InterviewDate extends BaseModel {
  @column({ isPrimary: true })
  declare idMaintenanceDate: number

  @column()
  declare interviewDate: DateTime

  @column()
  declare acceptApprenticeshipMaster: boolean

  @column()
  declare acceptTutor: boolean

  @column()
  declare acceptApprentice: boolean

  @column()
  declare statusInterviewDate: string
}
