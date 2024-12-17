import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import bcrypt from 'bcrypt'

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
      const { masterId, apprenticeIds } = request.only(['masterId', 'apprenticeIds'])

      // master existe ?
      const master = await db.from('apprentice_masters').where('id', masterId).first()
      if (!master) {
        return response.status(404).json({ message: 'Master not found' })
      }

      // Start Transaction
      await db.transaction(async (trx) => {
        // Update table apprentices for each apprentice
        for (const apprenticeId of apprenticeIds) {
          await trx
            .from('apprentices')
            .where('id', apprenticeId)
            .update({ idApprenticeMaster: masterId })
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
   * @property {number} idCompagny - L'ID de l'entreprise de l'utilisateur.
   *
   * @throws {InternalServerError} En cas d'erreur lors du traitement de la requête.
   *
   * @returns {Promise<Object>} Une promesse qui résout avec un objet JSON contenant un message de succès ou d'erreur.
   */
  async createOrUpdateApprenticeMaster({ request, response }: HttpContext) {
    try {
      const { name, lastName, email, companyName } = request.only([
        'name',
        'lastName',
        'email',
        'companyName',
      ])

      // Vérifier si l'entreprise existe, sinon la créer
      let idCompagny = 0
      let company = await db.from('compagies').where('name', companyName).first()
      if (!company) {
        const newIdCompany = await db
          .table('compagies')
          .insert({ name: companyName })
          .returning('idCompagny')
        idCompagny = newIdCompany[0]
      } else {
        idCompagny = company.idCompagny
      }
      console.log(`create New Compagny: ${idCompagny}`)

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await db.from('users').where('email', email).first()

      if (existingUser) {
        // Mettre à jour les informations de l'utilisateur existant
        await db.from('users').where('email', email).update({ name, lastName })

        // Vérifier si l'entrée existe dans apprentice_masters
        const existingMaster = await db
          .from('apprentice_masters')
          .where('id', existingUser.idUser)
          .first()

        if (existingMaster) {
          // Mettre à jour l'entrée dans apprentice_masters si nécessaire
          await db
            .from('apprentice_masters')
            .where('id', existingUser.idUser)
            .update({ idCompagny: idCompagny })
        } else {
          // Créer une nouvelle entrée dans apprentice_masters si elle n'existe pas
          await db.table('apprentice_masters').insert({
            id: existingUser.idUser,
            idCompagny: idCompagny,
          })
        }

        return response.status(200).json({ message: 'User updated successfully' })
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
          .returning('idUser')

        // Créer l'entrée dans la table apprentice_masters
        await db.table('apprentice_masters').insert({
          id: userId,
          idCompagny: idCompagny,
        })

        // Vous devriez envoyer le mot de passe par email à l'utilisateur ici
        console.log(`Mot de passe généré pour ${email}: ${password}`)

        return response.status(201).json({
          message: 'apprentice_masters created successfully',
          userId,
          compagnyId: idCompagny,
        })
      }
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        error: 'An error occurred while creating or updating the user: apprentice_masters',
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

  public async getApprenticeInfoByEmail({ request, response }: HttpContext) {
    try {
      const { email } = request.only(['email'])

      const existingUser = await db.from('users').where('email', email).first()

      if (existingUser) {
        const apprentice = await db.from('apprentices').where('id', existingUser.idUser).first()

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
}
