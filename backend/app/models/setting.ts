import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Setting extends BaseModel {
  @column({ isPrimary: true })
  declare idSetting: number

  @column()
  declare isNotificationActive: boolean

  @column()
  declare isReminderActive: boolean

  @column()
  declare userKey: number
}
