import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Reminder extends BaseModel {
  @column({ isPrimary: true })
  declare idReminder: number

  @column()
  declare name: string

  @column()
  declare delay: number
}
