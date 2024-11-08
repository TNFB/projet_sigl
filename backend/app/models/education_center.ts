import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class EducationCenter extends BaseModel {
  @column({ isPrimary: true })
  declare idEducationCenter: number

  @column()
  declare name: string

  @column()
  declare firstName: string

  @column()
  declare city: string

  @column()
  declare country: string

  @column()
  declare yearOfFormation: number

  @column()
  declare numberOfStudents: number

  @column()
  declare description: string

  @column()
  declare area: string
}
