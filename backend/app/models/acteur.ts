import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import TuteurPedagogique from './tuteur_pedagogique.js'
import Apprenti from './apprenti.js'
import MaitreApprentissage from './maitre_apprentissage.js'
import Professeur from './professeur.js'
import ResponsableCursus from './responsable_cursus.js'
import CoordinateurApprentissage from './coordinateur_apprentissage.js'
import Admin from './admin.js'

export default class Acteur extends BaseModel {
  @column({ isPrimary: true })
  declare id_acteur: number

  @column()
  declare nom: string

  @column()
  declare prenom: string

  @column.date()
  declare date_naissance: DateTime

  @column()
  declare genre: string

  @column()
  declare mail: string

  @column()
  declare password: string

  @column()
  declare telephone: string

  @column()
  declare actif: boolean

  @hasOne(() => TuteurPedagogique, { foreignKey: 'acteur_key' })
  declare tuteur: HasOne<typeof TuteurPedagogique>

  @hasOne(() => Apprenti, { foreignKey: 'acteur_key' })
  declare apprenti: HasOne<typeof Apprenti>

  @hasOne(() => MaitreApprentissage, { foreignKey: 'acteur_key' })
  declare maitre: HasOne<typeof MaitreApprentissage>

  @hasOne(() => Professeur, { foreignKey: 'acteur_key' })
  declare professeur: HasOne<typeof Professeur>

  @hasOne(() => ResponsableCursus, { foreignKey: 'acteur_key' })
  declare responsableCursus: HasOne<typeof ResponsableCursus>

  @hasOne(() => CoordinateurApprentissage, { foreignKey: 'acteur_key' })
  declare coordinateur: HasOne<typeof CoordinateurApprentissage>

  @hasOne(() => Admin, { foreignKey: 'acteur_key' })
  declare admin: HasOne<typeof Admin>
}
