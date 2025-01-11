import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Apprentice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare id_educational_tutor: number

  @column()
  declare id_apprentice_master: number

  @column()
  declare id_cursus: number

  @column()
  declare id_training_diary: number

  @column()
  declare id_company: number

  @column()
  declare list_missions: JSON

  @column()
  declare list_skills: JSON
}
