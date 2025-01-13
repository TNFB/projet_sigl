import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Jury extends BaseModel {
  @column({ isPrimary: true })
  declare id_jury: number

  @column()
  declare liste_id_jury: JSON
}
