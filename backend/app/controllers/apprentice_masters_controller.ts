import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import bcrypt from 'bcrypt'
import { findUserByEmail, isValidRole } from 'app/utils/apiUtils.js'

export default class ApprenticeMastersController {
  /**
   * @method addApprentices
   * @description Ajoute des apprentis à un maître d'apprentissage et met à jour leurs relations.
   *
   * Cette méthode effectue deux opérations principales :
   * 1. Elle ajoute les IDs des nouveaux apprentis à la liste des apprentis du maître dans la table 'apprentice_masters'.
   * 2. Elle met à jour l'ID du maître d'apprentissage pour chaque apprenti dans la table 'apprentices'.
   *
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   * @param {Object} context.request - L'objet de requête contenant les données.
   * @param {Object} context.response - L'objet de réponse pour envoyer le résultat.
   *
   * @property {number} masterId - L'ID du maître d'apprentissage.
   * @property {number[]} apprenticeIds - Un tableau d'IDs des apprentis à ajouter.
   *
   * @throws {NotFound} Si le maître d'apprentissage n'est pas trouvé.
   * @throws {InternalServerError} En cas d'erreur lors du traitement de la requête.
   *
   * @returns {Promise<Object>} Une promesse qui résout avec un objet JSON contenant un message de succès ou d'erreur.
   *
   * @example
   * // Exemple de requête
   * POST /add-apprentices
   * {
   *   "masterId": 1,
   *   "apprenticeIds": [101, 102, 103]
   * }
   *
   * // Exemple de réponse réussie
   * {
   *   "message": "Apprentices added successfully and master updated"
   * }
   */
  async addApprentices({ request, response }: HttpContext) {
    console.log('addApprentices')
    try {
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { masterId, apprenticeIds, token } = data

      // Vérifier si l'admin existe et si le token est valide
      if (! await isValidRole(token, 'admins')) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid role, token, or token has expired',
        })
      }

      // master existe ?
      const master = await db.from('apprentice_masters').where('id', masterId).first()
      if (!master) {
        return response.status(400).json({ message: 'Master not found' })
      }

      // Start Transaction
      await db.transaction(async (trx) => {
        // Update table apprentices for each apprentice
        for (const apprenticeId of apprenticeIds) {
          await trx
            .from('apprentices')
            .where('id', apprenticeId)
            .update({ id_apprentice_master: masterId })
        }
      })

      return response.status(200).json({ message: 'Apprentices added successfully' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'An error occurred while adding apprentices' })
    }
  }

  /**
   * @method createOrUpdateUser
   * @description Crée un nouvel utilisateur ou met à jour un utilisateur existant.
   *
   * Cette méthode effectue les opérations suivantes :
   * 1. Vérifie si un utilisateur avec l'email fourni existe déjà.
   * 2. Si l'utilisateur existe, met à jour ses informations.
   * 3. Si l'utilisateur n'existe pas, crée un nouvel utilisateur avec un mot de passe généré et haché.
   * 4. Crée ou met à jour l'entrée correspondante dans la table apprentice_masters.
   *
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   *
   * @property {string} name - Le nom de l'utilisateur.
   * @property {string} lastName - Le nom de famille de l'utilisateur.
   * @property {string} email - L'email de l'utilisateur.
   * @property {number} id_company - L'ID de l'entreprise de l'utilisateur.
   *
   * @throws {InternalServerError} En cas d'erreur lors du traitement de la requête.
   *
   * @returns {Promise<Object>} Une promesse qui résout avec un objet JSON contenant un message de succès ou d'erreur.
   */
  async createOrUpdateApprenticeMaster({ request, response }: HttpContext) {
    try {
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { peopleData, token } = data

      // Vérifier si l'admin existe et si le token est valide
      if (! await isValidRole(token, 'admins')) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid role, token, or token has expired',
        })
      }

      if (!Array.isArray(peopleData)) {
        return response.status(400).json({ error: 'Input should be an array of people' })
      }

      const results = []

      for (const person of peopleData) {
        const { name, lastName, email, companyName } = person

        // Vérifier si l'entreprise existe, sinon la créer
        let id_company = 0
        let company = await db.from('companies').where('name', companyName).first()
        if (!company) {
          const newid_company = await db
            .table('companies')
            .insert({ name: companyName })
            .returning('id_company')
          id_company = newid_company[0]
        } else {
          id_company = company.id_company
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await db.from('users').where('email', email).first()

        if (existingUser) {
          // Mettre à jour les informations de l'utilisateur existant
          await db.from('users').where('email', email).update({ name, lastName })

          // Vérifier si l'entrée existe dans apprentice_masters
          const existingMaster = await db
            .from('apprentice_masters')
            .where('id', existingUser.id_user)
            .first()

          if (existingMaster) {
            // Mettre à jour l'entrée dans apprentice_masters si nécessaire
            await db
              .from('apprentice_masters')
              .where('id', existingUser.id_user)
              .update({ id_company: id_company })
          } else {
            // Créer une nouvelle entrée dans apprentice_masters si elle n'existe pas
            await db.table('apprentice_masters').insert({
              id: existingUser.id_user,
              id_company: id_company,
            })
          }

          results.push({
            email,
            status: 'updated',
            userId: existingUser.id_user,
            compagnyId: id_company,
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
              role: 'apprentice_masters',
            })
            .returning('id_user')

          // Créer l'entrée dans la table apprentice_masters
          await db.table('apprentice_masters').insert({
            id: userId,
            id_company: id_company,
          })

          // Vous devriez envoyer le mot de passe par email à l'utilisateur ici
          console.log(`Mot de passe généré pour ${email}: ${password}`)

          results.push({ email, status: 'created', userId, compagnyId: id_company })
        }
      }

      return response.status(200).json({
        message: 'Apprentice masters processed successfully',
        results: results,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        error: 'An error occurred while processing apprentice masters',
      })
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
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { email, token } = data

      // Vérifier si l'admin existe et si le token est valide
      if (! await isValidRole(token, 'admins')) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid role, token, or token has expired',
        })
      }

      const existingUser = await findUserByEmail(email)

      if (existingUser) {
        const apprentice = await db.from('apprentices').where('id', existingUser.id_user).first()

        if (!apprentice || !apprentice.id_training_diary) {
          return response.status(404).json({
            status: 'not found',
            message: 'Training diary not found for this user',
          })
        }

        const trainingDiary = await db
          .from('training_diaries')
          .where('id_training_diary', apprentice.id_training_diary)
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

  public async getApprenticeInfoByEmail({ request, response }: HttpContext) {
    try {
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { email, token } = data

      // Vérifier si l'admin existe et si le token est valide
      if (! await isValidRole(token, 'admins')) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid role, token, or token has expired',
        })
      }

      const existingUser = await findUserByEmail(email)

      if (existingUser) {
        const apprentice = await db.from('apprentices').where('id', existingUser.id_user).first()

        return response.status(200).json({ apprentice })
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

  public async getApprenticesByMasterEmail({ request, response }: HttpContext) {
    try {
      const { data } = request.input('data')
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { email, token } = data
      // Vérifier si l'admin existe et si le token est valide
      if (! await isValidRole(token, 'admins')) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid role, token, or token has expired',
        })
      }

      if (!email) {
        return response.status(400).json({ error: 'Email is required' })
      }

      // Trouver le tuteur pédagogique par son email
      const master = await db
        .from('users')
        .where('email', email)
        .where('role', 'apprentice_masters')
        .first()

      if (!master) {
        return response.status(404).json({ error: 'Apprentice Masters not found' })
      }

      // Trouver les apprentis associés à ce tuteur
      const apprentices = await db
        .from('apprentices')
        .join('users', 'apprentices.id', 'users.id_user')
        .where('apprentices.id_apprentice_master', master.id_user)
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
          email: master.email,
          nom: master.name,
          prenom: master.lastName,
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
