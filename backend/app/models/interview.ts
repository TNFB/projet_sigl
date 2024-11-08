import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Interveiw extends BaseModel {
  @column({ isPrimary: true })
  declare idInterveiw: number

  @column()
  declare interveiwDateKey: number

  @column()
  declare semester: string
}
