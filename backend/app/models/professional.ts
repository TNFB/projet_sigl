import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Professional extends BaseModel {
  @column({ isPrimary: true })
  declare idProfessional: number
}
