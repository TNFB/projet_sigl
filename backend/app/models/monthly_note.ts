import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class MonthluNote extends BaseModel {
  @column({ isPrimary: true })
  declare id_monthly_note: number

  @column()
  declare id_traning_diary: number

  @column()
  declare title: string

  @column()
  declare content: string
}
