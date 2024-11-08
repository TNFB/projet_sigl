import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Soutenance extends BaseModel {
  @column({ isPrimary: true })
  declare idSoutenance: number

  @column()
  declare juryKey: number

  @column()
  declare soutenanceDate: DateTime

  @column()
  declare soutenanceHeure: DateTime
}
