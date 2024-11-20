import db from '@adonisjs/lucid/services/db'
import { HttpContext } from '@adonisjs/core/http'

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
    try {
      const { email, newPassword } = request.only(['email', 'newPassword'])

      const userCount = await db.from('users').count('* as total')
      if (userCount[0].total === 0) {
        console.log('User table empty')
        return response.status(404).json({
          status: 'error',
          message: 'No User table found/table users empty',
        })
      }

      // Found User by Email
      const userDb = await db.from('users').where('email', email).select('*').first()
      if (!userDb) {
        return response.status(404).json({
          status: 'error',
          message: 'Email not found',
        })
      }

      const bddPassword = userDb.password
      if (bddPassword === newPassword) {
        return response.status(422).json({
          status: 'error',
          Message: 'The new password is the same the old one',
        })
      } else {
        await db.from('users').where('email', email).update({ password: newPassword })
        return response.status(200).json({
          status: 'succes',
          message: 'password changed succesfully',
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in users overritePassword',
      })
    }
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
    try {
      const { email } = request.only(['email'])

      const userCount = await db.from('users').count('* as total')
      if (userCount[0].total === 0) {
        console.log('User table empty')
        return response.status(404).json({
          status: 'error',
          message: 'No User table found/table users empty',
        })
      }

      // Found User by Email
      const userDb = await db.from('users').where('email', email).select('*').first()
      if (!userDb) {
        return response.status(404).json({
          status: 'error',
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
}
