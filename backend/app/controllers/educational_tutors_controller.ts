import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import bcrypt from 'bcrypt'

export default class EducationalTutorsController {
  /**
   * @method addApprentices
   * @description Ajoute une liste d'apprentis à un tuteur éducatif.
   *
   * Cette méthode met à jour le champ JSON `listeIdApprentice` dans la table `educational_tutors`
   * pour inclure les apprentis spécifiés. Elle met également à jour la table `apprentices`
   * pour associer chaque apprenti au tuteur éducatif.
   *
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   * @param {Object} context.request - L'objet de requête contenant les données.
   * @param {Object} context.response - L'objet de réponse pour envoyer le résultat.
   *
   * @property {number} tutorId - L'ID du tuteur éducatif.
   * @property {number[]} apprenticeIds - Un tableau contenant les IDs des apprentis à ajouter.
   *
   * @throws {NotFound} Si le tuteur éducatif n'est pas trouvé.
   * @throws {InternalServerError} En cas d'erreur lors de l'ajout des apprentis.
   *
   * @returns {Promise<Object>} Une promesse qui résout avec un objet JSON contenant un message de succès.
   *
   * @example
   * // Exemple de requête
   * POST /educational-tutors/add-apprentices
   * {
   *   "tutorId": 1,
   *   "apprenticeIds": [3, 4, 5]
   * }
   *
   * // Exemple de réponse réussie
   * {
   *   "message": "Apprentices added successfully"
   * }
   *
   * // Exemple de réponse en cas de tuteur non trouvé
   * {
   *   "message": "educational tutors not found"
   * }
   *
   * // Exemple de réponse en cas d'erreur interne
   * {
   *   "message": "An error occurred while adding apprentices"
   * }
   */

  async addApprentices({ request, response }: HttpContext) {
    console.log('addApprentices')
    try {
      const { tutorId, apprenticeIds } = request.only(['tutorId', 'apprenticeIds'])

      // master existe ?
      const master = await db.from('educational_tutors').where('id', tutorId).first()
      if (!master) {
        return response.status(400).json({ message: 'educational tutors not found' })
      }

      // get apprentice list (if existe)
      let currentApprentices = master.listeIdApprentice ? JSON.parse(master.listeIdApprentice) : []

      // add new apprentices ID
      const newApprentices = [...new Set([...currentApprentices, ...apprenticeIds])]

      // Start Transaction
      await db.transaction(async (trx) => {
        // Update educational_tutors
        await trx
          .from('educational_tutors')
          .where('id', tutorId)
          .update({ listeIdApprentice: JSON.stringify(newApprentices) })

        // Update table apprentices for each apprentice
        for (const apprenticeId of apprenticeIds) {
          await trx
            .from('apprentices')
            .where('id', apprenticeId)
            .update({ idEducationalTutor: tutorId })
        }
      })

      return response.status(200).json({ message: 'Apprentices added successfully' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'An error occurred while adding apprentices' })
    }
  }

  /**
   * @method assignEducationalTutorRole
   * @description Attribue le rôle "educational_tutor" à un utilisateur existant et l'ajoute à la table educational_tutors.
   *
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   * @param {Object} context.request - L'objet de requête contenant les données.
   * @param {Object} context.response - L'objet de réponse pour envoyer le résultat.
   *
   * @throws {BadRequest} Si l'email n'est pas fourni.
   * @throws {NotFound} Si l'utilisateur n'est pas trouvé.
   * @throws {InternalServerError} En cas d'erreur lors de l'attribution du rôle.
   *
   * @returns {Promise<Object>} Une promesse qui résout avec un objet JSON contenant le résultat de l'opération.
   */
  public async assignEducationalTutorRole({ request, response }: HttpContext) {
    try {
      const { email } = request.only(['email'])

      if (!email) {
        return response.status(400).json({ message: 'Email is required' })
      }

      // Trouver l'utilisateur par email
      const user = await db.from('users').where('email', email).first()

      if (!user) {
        return response.status(400).json({ message: 'User not found' })
      }

      // Commencer une transaction
      await db.transaction(async (trx) => {
        // Mettre à jour le rôle de l'utilisateur
        await trx.from('users').where('idUser', user.idUser).update({ role: 'educational_tutor' })

        // Insérer l'ID de l'utilisateur dans la table educational_tutors
        await trx.table('educational_tutors').insert({ id: user.idUser })
      })

      return response.status(200).json({
        message: 'User successfully assigned as educational tutor',
        userId: user.idUser,
      })
    } catch (error) {
      console.error(error)
      return response
        .status(500)
        .json({ message: 'An error occurred while assigning educational tutor role' })
    }
  }

  /**
   * @method getTrainingDiary
   * @description Récupère le journal de formation d'un apprenti spécifique en utilisant son email.
   *
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   * @param {Object} context.params - Les paramètres de la route.
   * @param {Object} context.response - L'objet de réponse pour envoyer le résultat.
   *
   * @throws {NotFound} Si l'apprenti ou son journal de formation n'est pas trouvé.
   * @throws {InternalServerError} En cas d'erreur lors de la récupération du journal.
   *
   * @returns {Promise<Object>} Une promesse qui résout avec le journal de formation de l'apprenti.
   */
  public async getTrainingDiaryByEmail({ request, response }: HttpContext) {
    try {
      const { email } = request.only(['email'])

      const existingUser = await db.from('users').where('email', email).first()

      if (existingUser) {
        const apprentice = await db.from('apprentices').where('id', existingUser.idUser).first()

        if (!apprentice || !apprentice.idTrainingDiary) {
          return response.status(404).json({
            status: 'not found',
            message: 'Training diary not found for this user',
          })
        }

        const trainingDiary = await db
          .from('training_diaries')
          .where('idTrainingDiary', apprentice.idTrainingDiary)
          .first()

        if (!trainingDiary) {
          return response.status(404).json({
            status: 'not found',
            message: 'Training diary not found',
          })
        }

        return response.status(200).json({ trainingDiary })
      } else {
        return response.status(404).json({
          status: 'not found',
          message: 'User not found',
        })
      }
    } catch (error) {
      console.error(error)
      return response
        .status(500)
        .json({ message: 'An error occurred while fetching the training diary' })
    }
  }

  async createOrUpdateEducationalTutor({ request, response }: HttpContext) {
    try {
      const peopleData = request.input('data')

      if (!Array.isArray(peopleData)) {
        return response.status(400).json({ error: 'Input should be an array of people' })
      }

      const results = []

      for (const person of peopleData) {
        const { name, lastName, email } = person

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await db.from('users').where('email', email).first()

        if (existingUser) {
          // Mettre à jour les informations de l'utilisateur existant
          await db.from('users').where('email', email).update({ name, lastName })

          // Vérifier si l'entrée existe dans educational_tutors
          const existingTutor = await db
            .from('educational_tutors')
            .where('id', existingUser.idUser)
            .first()

          if (!existingTutor) {
            // Créer une nouvelle entrée dans educational_tutors si elle n'existe pas
            await db.table('educational_tutors').insert({
              id: existingUser.idUser,
            })
          }

          results.push({
            email,
            status: 'updated',
            userId: existingUser.idUser,
          })
        } else {
          // Créer un nouvel utilisateur
          const password = Math.random().toString(36).slice(-8) // Générer un mot de passe aléatoire
          const hashedPassword = await bcrypt.hash(password, 10)

          const [userId] = await db
            .table('users')
            .insert({
              email,
              name,
              lastName,
              password: hashedPassword,
              role: 'educational_tutors',
            })
            .returning('idUser')

          // Créer l'entrée dans la table educational_tutors
          await db.table('educational_tutors').insert({
            id: userId,
          })

          // Vous devriez envoyer le mot de passe par email à l'utilisateur ici
          console.log(`Mot de passe généré pour ${email}: ${password}`)

          results.push({ email, status: 'created', userId })
        }
      }

      return response.status(200).json({
        message: 'Educational tutors processed successfully',
        results: results,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        error: 'An error occurred while processing educational tutors',
      })
    }
  }

  async getApprenticesByTutorEmail({ request, response }: HttpContext) {
    try {
      const { email } = request.input('data')

      if (!email) {
        return response.status(400).json({ error: 'Email is required' })
      }

      // Trouver le tuteur pédagogique par son email
      const tutor = await db
        .from('users')
        .where('email', email)
        .where('role', 'educational_tutors')
        .first()

      if (!tutor) {
        return response.status(404).json({ error: 'Educational tutor not found' })
      }

      // Trouver les apprentis associés à ce tuteur
      const apprentices = await db
        .from('apprentices')
        .join('users', 'apprentices.id', 'users.idUser')
        .where('apprentices.idEducationalTutor', tutor.idUser)
        .select('users.email', 'users.name', 'users.lastName')

      // Formater les données des apprentis
      const formattedApprentices = apprentices.map((apprentice) => ({
        email: apprentice.email,
        nom: apprentice.name,
        prenom: apprentice.lastName,
      }))

      // Créer l'objet JSON de réponse
      const responseData = {
        tuteur: {
          email: tutor.email,
          nom: tutor.name,
          prenom: tutor.lastName,
        },
        apprentis: formattedApprentices,
      }

      return response.status(200).json(responseData)
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        error: 'An error occurred while retrieving apprentices',
      })
    }
  }
}
