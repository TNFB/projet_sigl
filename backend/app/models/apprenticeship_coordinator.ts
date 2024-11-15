import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ApprenticeshipCoordinator extends BaseModel {
  @column({ isPrimary: true })
  declare idApprenticeshipCoordinator: number
}
