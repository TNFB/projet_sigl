import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class CompanyRepresentativesController {
  /**
   * @method addMissionToApprentice
   * @description Ajoute une nouvelle mission à la liste des missions d'un apprenti.
   *
   * Cette méthode prend les détails de la mission et l'ID de l'apprenti,
   * puis ajoute la mission à la liste existante dans le champ JSON 'listMissions'.
   *
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   * @param {Object} context.request - L'objet de requête contenant les données.
   * @param {Object} context.response - L'objet de réponse pour envoyer le résultat.
   *
   * @property {number} apprenticeId - L'ID de l'apprenti.
   * @property {Object} mission - Les détails de la mission à ajouter.
   * @property {string} mission.titreMission - Le titre de la mission.
   * @property {string} mission.descriptionMission - La description de la mission.
   * @property {string[]} mission.competences - Un tableau des compétences liées à la mission.
   *
   * @throws {NotFound} Si l'apprenti n'est pas trouvé.
   * @throws {BadRequest} Si les détails de la mission sont incomplets.
   * @throws {InternalServerError} En cas d'erreur lors de l'ajout de la mission.
   *
   * @returns {Promise<Object>} Une promesse qui résout avec un objet JSON contenant un message de succès.
   *
   * @example
   * // Exemple de requête
   * POST /add-mission-to-apprentice
   * {
   *   "apprenticeId": 1,
   *   "mission": {
   *     "titreMission": "Développement d'une API REST",
   *     "descriptionMission": "Concevoir et implémenter une API REST pour notre nouveau service",
   *     "competences": ["Node.js", "Express", "MongoDB"]
   *   }
   * }
   *
   * // Exemple de réponse réussie
   * {
   *   "message": "Mission added successfully to apprentice's list"
   * }
   */
  public async addMissionToApprentice({ request, response }: HttpContext) {
    console.log('addMissionToApprentice')
    try {
      const { apprenticeId, mission } = request.only(['apprenticeId', 'mission'])

      // check apprentice exist
      const apprentice = await db.from('apprentices').where('id', apprenticeId).first()
      if (!apprentice) {
        return response.status(404).json({ message: 'Apprentice not found' })
      }

      // check all mission field
      if (!mission.titreMission || !mission.descriptionMission || !mission.competences) {
        return response.status(400).json({ message: 'Mission details are incomplete' })
      }

      // get current mission
      let listMissions = apprentice.listMissions ? JSON.parse(apprentice.listMissions) : []

      // add new mission
      listMissions.push({
        'Titre mission': mission.titreMission,
        'Description Mission': mission.descriptionMission,
        'competances': mission.competences,
      })

      // update DB
      await db
        .from('apprentices')
        .where('id', apprenticeId)
        .update({ listMissions: JSON.stringify(listMissions) })

      return response
        .status(200)
        .json({ message: "Mission added successfully to apprentice's list" })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'An error occurred while adding the mission' })
    }
  }
}
