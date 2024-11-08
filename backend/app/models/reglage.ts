import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Reglage extends BaseModel {
  @column({ isPrimary: true })
  declare idReglage: number

  @column()
  declare isNotificationActive: boolean

  @column()
  declare isRappelActive: boolean

  @column()
  declare acteurKey: number
}
