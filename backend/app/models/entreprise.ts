import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Entreprise extends BaseModel {
  @column({ isPrimary: true })
  declare idEntreprise: number

  @column()
  declare nom: string

  @column()
  declare adresse: string

  @column()
  declare ville: string

  @column()
  declare pays: string

  @column()
  declare anneeCollaboration: number

  @column()
  declare domaine: string

  @column()
  declare description: string

  @column()
  declare nombreApprenti: number
}
