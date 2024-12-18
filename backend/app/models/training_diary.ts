import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TrainingDiary extends BaseModel {
  @column({ isPrimary: true })
  declare idTrainingDiary: number

  @column()
  declare semesterGrades: JSON

  @column()
  declare documentList: JSON

  @column()
  declare evaluation: number

  @column()
  declare listInterview: JSON

  @column()
  declare listReport: JSON

  @column()
  declare listPresentation: JSON
}
