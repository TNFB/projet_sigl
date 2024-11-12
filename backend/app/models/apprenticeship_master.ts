import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ApprenticeshipMaster extends BaseModel {
  @column({ isPrimary: true })
  declare idMaster: number

  @column()
  declare userKey: number

  @column()
  declare currentCompagnyKey: number

  @column()
  declare position: string
}
