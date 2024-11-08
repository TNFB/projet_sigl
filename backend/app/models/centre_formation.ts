import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CentreFormation extends BaseModel {
  @column({ isPrimary: true })
  declare idCentreFormation: number

  @column()
  declare nom: string

  @column()
  declare prenom: string

  @column()
  declare ville: string

  @column()
  declare pays: string

  @column()
  declare anneeFormation: number

  @column()
  declare nombreEtudiant: number

  @column()
  declare description: string

  @column()
  declare domaine: string
}
