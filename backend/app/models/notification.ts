import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  declare idNotification: number

  @column()
  declare acteurKey: number

  @column()
  declare type: string

  @column()
  declare isActive: boolean

  @column()
  declare notificationDate: DateTime
}
