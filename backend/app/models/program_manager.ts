import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ProgramManager extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare list_id_cursus: JSON
}
