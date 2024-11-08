import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Entretien extends BaseModel {
  @column({ isPrimary: true })
  declare idEntretien: number

  @column()
  declare dateEntretienKey: number

  @column()
  declare semestre: string
}
