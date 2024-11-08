import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ProInvite extends BaseModel {
  @column({ isPrimary: true })
  declare idProInvite: number

  @column()
  declare entrepriseKey: number

  @column()
  declare nombreJury: number
}
