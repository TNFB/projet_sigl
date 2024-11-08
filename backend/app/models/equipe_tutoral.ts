import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class EquipeTutoral extends BaseModel {
  @column({ isPrimary: true })
  declare idEquipeTutoral: number

  @column()
  declare apprentiKey: number

  @column()
  declare maitreApprentissageKey: number

  @column()
  declare tuteurKey: number

  @column()
  declare dateDebut: DateTime

  @column()
  declare dateFin: DateTime
}
