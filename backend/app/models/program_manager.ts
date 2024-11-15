import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ProgramManager extends BaseModel {
  @column({ isPrimary: true })
  declare idprogramManager: number

  @column()
  declare listIdCursus: JSON
}
