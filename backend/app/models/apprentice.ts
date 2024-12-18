import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Apprentice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idEducationalTutor: number

  @column()
  declare idApprenticeMaster: number

  @column()
  declare idCursus: number

  @column()
  declare idTrainingDiary: number

  @column()
  declare idCompagny: number

  @column()
  declare listMissions: JSON
}
