import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TrainingDiary extends BaseModel {
  @column({ isPrimary: true })
  declare id_training_diary: number

  @column()
  declare semester_grades: JSON

  @column()
  declare document_list: JSON

  @column()
  declare evaluation: number

  @column()
  declare list_interview: JSON

  @column()
  declare list_report: JSON

  @column()
  declare list_presentation: JSON
}
