import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class DateEntretien extends BaseModel {
  @column({ isPrimary: true })
  declare idDateEntretien: number

  @column()
  declare entretienDate: DateTime

  @column()
  declare acceptMA: boolean

  @column()
  declare acceptTuteur: boolean

  @column()
  declare acceptApprenti: boolean

  @column()
  declare statusDateEntretien: string
}
