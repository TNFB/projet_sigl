import db from '@adonisjs/lucid/services/db'
import bcrypt from 'bcrypt'
import { findUserByEmail, isUserTableEmpty, isValidRole } from '../utils/api_utils.js'
import { HttpContext } from '@adonisjs/core/http'
import { sendEmailToUser } from '../utils/email_utils.js'

/**
 * @class AdminController
 * @description Contrôleur gérant les opérations administratives liées aux utilisateurs.
 *
 * Cette classe fournit des méthodes pour effectuer des actions administratives
 * sur les comptes utilisateurs, telles que la modification forcée de mots de passe.
 */
export default class AdminController {
  /**
   * @brief Remplace le mot de passe d'un utilisateur existant.
   *
   * Cette méthode vérifie l'existence de l'utilisateur dans la base de données en fonction de son email,
   * puis remplace son mot de passe par le nouveau mot de passe fourni, sans vérification de l'ancien mot de passe.
   *
   * @param {HttpContext} context - Le contexte HTTP contenant la requête et la réponse.
   * @param {Object} context.request - L'objet de requête HTTP contenant l'email et le nouveau mot de passe.
   * @param {Object} context.response - L'objet de réponse HTTP utilisé pour renvoyer des réponses au client.
   *
   * @throws {NotFound} Si la table des utilisateurs est vide ou si aucun utilisateur n'est trouvé avec l'email fourni.
   * @throws {UnprocessableEntity} Si le nouveau mot de passe est identique à l'ancien.
   * @throws {InternalServerError} En cas d'erreur lors du traitement du remplacement du mot de passe.
   *
   * @return {Promise<Object>} Une promesse qui résout un objet JSON contenant le statut et un message
   *                           indiquant le résultat de l'opération (succès ou type d'erreur).
   */
  async overritePassword({ request, response }: HttpContext) {
    console.log('overritePassword')
    try {
      //Get JSON 'Data'
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { email } = data

      if (await isUserTableEmpty()) {
        console.log('User table empty')
        return response.status(400).json({
          status: 'error',
          message: 'No User table found/table users empty',
        })
      }

      const emailUser = (request as any).user?.email
      if (!emailUser) {
        return response.status(401).json({ error: 'Unauthorized' })
      }
      // Vérifier si l'admin existe et si le token est valide
      if (!(await isValidRole(emailUser, 'admins'))) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid role',
        })
      }

      const userDb = await findUserByEmail(email)
      console.log(userDb)

      if (!userDb) {
        return response.notFound({
          message: 'User not found',
        })
      }
      // Check if same Password
      const newPassword = this.generateRandomPassword()
      const isPasswordValid = await bcrypt.compare(newPassword, userDb.password)
      if (isPasswordValid) {
        return response.status(422).json({
          status: 'error',
          message: 'The new password is the same as the old one',
        })
      }

      //Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      console.log(userDb.id_user)
      // Mettre à jour le mot de passe
      await db.from('users').where('id_user', userDb.id_user).update({
        password: hashedPassword,
      })

      // Envoyer un email à l'utilisateur avec le nouveau mot de passe
      const emailContent = `Bonjour ${userDb.name} ${userDb.last_name},\n\nVotre mot de passe a été réinitialisé. Voici votre nouveau mot de passe temporaire :\n\nMot de passe : ${newPassword}\n\nVeuillez vous connecter et changer votre mot de passe dès que possible.\n\nCordialement,\nL'équipe`
      await sendEmailToUser(email, 'Réinitialisation de votre mot de passe', emailContent)

      return response.status(200).json({
        status: 'success',
        message: 'Password changed successfully',
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Error in users overritePassword',
      })
    }
  }

  private generateRandomPassword(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  /**
   * @method deleteUserByEmail
   * @description Supprime un utilisateur de la base de données en fonction de son email.
   *
   * Cette méthode permet à un administrateur de supprimer un compte utilisateur
   * en utilisant l'adresse email comme identifiant unique. Elle vérifie l'existence
   * de l'utilisateur avant de procéder à la suppression.
   *
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   * @returns {Promise<Object>} Une réponse JSON indiquant le résultat de l'opération.
   *
   * @throws {NotFound} Si l'utilisateur n'existe pas ou si la table des utilisateurs est vide.
   * @throws {InternalServerError} En cas d'erreur lors du traitement de la requête.
   */
  async deleteUser({ request, response }: HttpContext) {
    console.log('deleteUser')
    try {
      //Get JSON 'Data'
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { email } = data

      //Table User Vide ?
      if (await isUserTableEmpty()) {
        console.log('User table empty')
        return response.status(400).json({
          status: 'error',
          message: 'No User table found/table users empty',
        })
      }

      const emailUser = (request as any).user?.email
      if (!emailUser) {
        return response.status(401).json({ error: 'Unauthorized' })
      }
      // Vérifier si l'admin existe et si le token est valide
      if (!(await isValidRole(emailUser, 'admins'))) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid role',
        })
      }

      // Found User by Email
      const userDb = await findUserByEmail(email)

      if (!userDb) {
        return response.notFound({
          message: 'Email not found',
        })
      }

      await db.from('users').where('email', email).delete()

      return response.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in users deleteUser',
      })
    }
  }

  public async linkApprentice({ request, response }: HttpContext) {
    try {
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }

      const { peopleData } = data

      const emailUser = (request as any).user?.email
      if (!emailUser) {
        return response.status(401).json({ error: 'Unauthorized' })
      }
      // Vérifier si l'admin existe et si le token est valide
      if (!(await isValidRole(emailUser, 'admins'))) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid role',
        })
      }

      if (!Array.isArray(peopleData) || peopleData.length === 0) {
        return response
          .status(400)
          .json({ message: 'Invalid input: data should be a non-empty array' })
      }

      const results = []

      for (const liaison of peopleData) {
        const { apprenticeEmail, masterEmail, tutorEmail } = liaison

        // Vérifier si l'apprenti existe et s'il a le bon rôle
        const apprentice = await db
          .from('users')
          .where('email', apprenticeEmail)
          .where('role', 'apprentices')
          .first()
        if (!apprentice) {
          results.push({
            status: 'error',
            message: 'Apprenti non trouvé ou rôle incorrect',
            apprenticeEmail,
          })
          continue
        }

        // Vérifier si le maître d'apprentissage existe et s'il a le bon rôle
        const apprenticeMaster = await db
          .from('users')
          .where('email', masterEmail)
          .where('role', 'apprentice_masters')
          .first()
        if (!apprenticeMaster) {
          results.push({
            status: 'error',
            message: "Maître d'apprentissage non trouvé ou rôle incorrect",
            masterEmail,
          })
          continue
        }

        // Vérifier si le tuteur pédagogique existe et s'il a le bon rôle
        const educationalTutor = await db
          .from('users')
          .where('email', tutorEmail)
          .where('role', 'educational_tutors')
          .first()
        if (!educationalTutor) {
          results.push({
            status: 'error',
            message: 'Tuteur pédagogique non trouvé ou rôle incorrect',
            tutorEmail,
          })
          continue
        }

        // Mettre à jour l'enregistrement de l'apprenti pour lier les IDs
        await db.from('apprentices').where('id', apprentice.id_user).update({
          id_apprentice_master: apprenticeMaster.id_user,
          id_educational_tutor: educationalTutor.id_user,
        })

        results.push({
          status: 'success',
          message: 'Liaison créée avec succès',
          apprenticeId: apprentice.id_user,
          masterId: apprenticeMaster.id_user,
          tutorId: educationalTutor.id_user,
        })
      }

      return response.status(200).json({
        message: 'Traitement des liaisons terminé',
        results,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: 'Une erreur est survenue lors du traitement des liaisons',
        error: error.message,
      })
    }
  }
}
