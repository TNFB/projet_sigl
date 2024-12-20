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
    console.log('overritePassword')
    try {
      // Récupérer les données du JSON d'entrée
      const { token, email, newPassword } = request.only(['token', 'email', 'newPassword'])
  
      const userCount = await db.from('users').count('* as total')
      if (userCount[0].total === 0) {
        console.log('User table empty')
        return response.status(400).json({
          status: 'error',
          message: 'No User table found/table users empty',
        })
      }
      
      // HACK TOKEN?
      // Vérifier si l'utilisateur existe et si le token est valide
      const userDb = await db.from('users')
        .where('email', email)
        .where('token', token)
        .where('expired_date', '>', new Date()) // Vérifier si le token n'a pas expiré
        .select('*')
        .first()
  
      if (!userDb) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid email, token, or token has expired',
        })
      }
  
      // Vérifier si le nouveau mot de passe est différent de l'ancien
      if (userDb.password === newPassword) {
        return response.status(422).json({
          status: 'error',
          message: 'The new password is the same as the old one',
        })
      }
  
      // Mettre à jour le mot de passe
      await db.from('users')
        .where('email', email)
        .update({ 
          password: newPassword,
          token: null, // Optionnel : réinitialiser le token après utilisation
          expired_date: null // Optionnel : réinitialiser la date d'expiration
        })
  
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
      const { email } = request.only(['email'])

      const userCount = await db.from('users').count('* as total')
      if (userCount[0].total === 0) {
        console.log('User table empty')
        return response.status(400).json({
          status: 'error',
          message: 'No User table found/table users empty',
        })
      }

      // Found User by Email
      const userDb = await db.from('users').where('email', email).select('*').first()
      if (!userDb) {
        return response.status(400).json({
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
