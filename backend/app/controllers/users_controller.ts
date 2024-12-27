import db from '@adonisjs/lucid/services/db'
import { HttpContext } from '@adonisjs/core/http'
import bcrypt from 'bcrypt'
import { findUserByEmail, isUserTableEmpty, isValidRole } from '../utils/api_utils.js'
import jwt from 'jsonwebtoken'

/**
 * @class UsersController
 * @brief Contrôleur pour gérer les utilisateurs.
 *
 * Ce contrôleur fournit des méthodes pour créer, récupérer et gérer les utilisateurs dans l'application.
 */
export default class UsersController {
  /**
   * @brief Récupère les emails des utilisateurs en fonction du rôle spécifié.
   *
   * Cette méthode vérifie si la table des utilisateurs est vide, puis récupère les emails des utilisateurs
   * en fonction du rôle spécifié. Si aucun rôle n'est spécifié, elle renvoie tous les emails.
   *
   * @param {HttpContext} context - Le contexte HTTP contenant la requête et la réponse.
   * @param {Object} context.request - L'objet de requête HTTP.
   * @param {Object} context.response - L'objet de réponse HTTP utilisé pour renvoyer des réponses au client.
   *
   * @throws {NotFound} Si la table des utilisateurs est vide.
   * @throws {InternalServerError} En cas d'erreur lors du traitement de la récupération des utilisateurs.
   *
   * @return {Promise<Object>} - Une promesse qui résout un objet JSON contenant le statut et la liste des emails des utilisateurs.
   */
  async getUserEmailsByRole({ request, response }: HttpContext) {
    console.log('getUserEmailsByRole')
    try {
      // Récupérer le rôle depuis les paramètres de la requête
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { role, token } = data

      //Need to check token
      if (!(await isValidRole(token, 'admins'))) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid role, token, or token has expired',
        })
      }

      // Vérifier si la table 'users' est vide
      if (await isUserTableEmpty()) {
        console.log('User table empty')
        return response.status(400).json({
          status: 'error',
          message: 'No users table found/users table empty',
        })
      }

      // Préparer la requête
      let query = db.from('users').select('email')

      // Si un rôle est spécifié, filtrer par ce rôle
      if (role) {
        query = query.where('role', role)
      }

      // Exécuter la requête
      const users = await query

      // Extraire uniquement les emails
      const emails = users.map((user) => user.email)

      return response.status(200).json({
        status: 'success',
        emails: emails,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur dans getUserEmailsByRole',
      })
    }
  }

  /**
   * @brief Crée un nouvel utilisateur.
   *
   * Cette méthode vérifie si l'email de l'utilisateur existe déjà dans la base de données avant de créer
   * un nouvel utilisateur. Elle assigne également le rôle à l'utilisateur créé si celui-ci est valide.
   *
   * @param {HttpContext} context - Le contexte HTTP contenant la requête et la réponse.
   * @param {Object} context.request - L'objet de requête HTTP contenant les données nécessaires à la création de l'utilisateur.
   * @param {Object} context.response - L'objet de réponse HTTP utilisé pour renvoyer des réponses au client.
   *
   * @throws {BadRequest} Si l'email existe déjà ou si le rôle est invalide.
   * @throws {InternalServerError} En cas d'erreur lors du traitement de la création de l'utilisateur.
   *
   * @return {Promise<Object>} - Une promesse qui résout un objet JSON contenant le statut, un message et les détails de l'utilisateur créé.
   */
  async createUser({ request, response }: HttpContext) {
    console.log('createUser')
    try {
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { email, password, name, lastName, telephone, role, token } = data

      //Need to check token
      if (!(await isValidRole(token, 'admins'))) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid role, token, or token has expired',
        })
      }

      //Check if Email Existe
      const emailDB = await db.from('users').where('email', email).count('* as total')
      if (emailDB[0].total > 0) {
        return response.status(400).json({
          status: 'error',
          message: `email: ${email} already existe in DB`,
        })
      }

      //Create User
      const hashedPassword = await bcrypt.hash(password, 10)
      const createUser = await db
        .table('users')
        .insert({ email, password: hashedPassword, name, lastName, telephone, role })
      console.log(`User created: ${createUser}`)

      //assigne Role
      let id = createUser
      console.log('role', role)
      if (role && role !== '') {
        await db.table(role).insert({ id })
      } else {
        return response.status(200).json({
          status: 'success',
          message: 'User created without role',
        })
      }
      console.log(`User Role created ${createUser[0].role}`)
      return response.status(200).json({
        status: 'success',
        message: 'users created',
        users: createUser,
        role: role,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in createUser',
      })
    }
  }

  /**
   * @brief Connecte un utilisateur et crée un token d'accès.
   *
   * Cette méthode vérifie si l'email et le mot de passe fournis correspondent à un utilisateur existant
   * dans la base de données. Si c'est le cas, elle crée un token d'accès et le renvoie au client via un cookie.
   *
   * @param {HttpContext} context - Le contexte HTTP contenant la requête et la réponse.
   * @param {Object} context.request - L'objet de requête HTTP contenant les informations d'identification de l'utilisateur.
   * @param {Object} context.response - L'objet de réponse HTTP utilisé pour renvoyer des réponses au client.
   *
   * @throws {NotFound} Si aucun utilisateur n'est trouvé avec l'email fourni ou si la table est vide.
   * @throws {Unauthorized} Si le mot de passe fourni est incorrect.
   * @throws {InternalServerError} En cas d'erreur lors du traitement de la connexion.
   *
   * @return {Promise<Object>} - Une promesse qui résout un objet JSON contenant le statut et le token d'accès en cas de succès,
   *                             ou une erreur en cas d'échec.
   */
  async connectionUser({ request, response }: HttpContext) {
    console.log('Connexion')
    try {
      const { data } = request.only(['data'])
      if (!data || !data.email || !data.password) {
        return response.status(400).json({ error: 'Email and password are required' })
      }
      const { email, password } = data

      // Vérifier si la table 'users' est vide
      if (await isUserTableEmpty()) {
        console.log('User table empty')
        return response.status(400).json({
          status: 'error',
          message: 'No users table found/users table empty',
        })
      }

      // Found User by Email
      const userDb = await findUserByEmail(email)
      if (!userDb) {
        return response.status(401).json({
          status: 'error',
          message: 'Email not found in User',
        })
      }

      const isPasswordValid = await bcrypt.compare(password, userDb.password)
      if (isPasswordValid) {
        //TODO
        // Gerer Token => Inserte Token In BDD if user can connect
        // Maybe add 1-2sec delay if password Wrong
        const token = jwt.sign(
          { id: userDb.id_user, email: userDb.email, role: userDb.role },
          process.env.APP_KEY,
          {
            expiresIn: '1h',
          }
        )
        return response.status(200).json({
          status: 'success',
          token: token,
        })
      } else {
        return response.status(401).json({
          status: 'error',
          message: 'password incorrect',
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in users connection',
      })
    }
  }

  /**
   * @brief Déconnecte l'utilisateur en supprimant le cookie d'accès.
   *
   * Cette méthode efface le cookie d'accès pour déconnecter l'utilisateur et renvoie une réponse indiquant que
   * la déconnexion a été effectuée avec succès.
   *
   * @param {HttpContext} context - Le contexte HTTP contenant la réponse.
   * @param {Object} context.response - L'objet de réponse HTTP utilisé pour renvoyer des réponses au client.
   *
   * @return {Promise<Object>} - Une promesse qui résout un objet JSON contenant le statut et un message indiquant que 
                               la déconnexion a réussi.
   */
  async logoutUser({ request, response }: HttpContext) {
    const { data } = request.only(['data'])
    if (!data) {
      return response.status(400).json({ error: 'Data is required' })
    }
    const { token } = data

    const users = await db.from('users').select('token')

    for (const user of users) {
      const isTokenMatch = await bcrypt.compare(token, user.token)
      if (isTokenMatch) {
        await db.from('users').where('id_user', user.id_user).update({
          token: null, // Optionnel : réinitialiser le token après utilisation
          expired_date: null, // Optionnel : réinitialiser la date d'expiration
        })
        return response.status(200).json({
          status: 'success',
          message: 'Logout succesfull',
        })
      }
    }
    return response.status(400).json({
      status: 'faill',
      message: 'Faill to Logout',
    })
  }

  /**
   * @brief Change le mot de passe d'un utilisateur existant.
   *
   * Cette méthode vérifie l'existence de l'utilisateur dans la base de données en fonction de son email,
   * puis met à jour son mot de passe si les conditions sont remplies.
   *
   * @param {HttpContext} context - Le contexte HTTP contenant la requête et la réponse.
   * @param {Object} context.request - L'objet de requête HTTP contenant les informations pour changer le mot de passe.
   * @param {Object} context.response - L'objet de réponse HTTP utilisé pour renvoyer des réponses au client.
   *
   * @throws {NotFound} Si la table des utilisateurs est vide ou si aucun utilisateur n'est trouvé avec l'email fourni.
   * @throws {UnprocessableEntity} Si le nouveau mot de passe est identique à l'ancien.
   * @throws {Unauthorized} Si l'ancien mot de passe fourni est incorrect.
   * @throws {InternalServerError} En cas d'erreur lors du traitement du changement du mot de passe.
   *
   * @return {Promise<Object>} Une promesse qui résout un objet JSON contenant le statut et un message
   *                           indiquant le résultat de l'opération (succès ou type d'erreur).
   */
  async changePassword({ request, response }: HttpContext) {
    try {
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { email, oldPassword, newPassword, token } = data

      // Vérifier si la table 'users' est vide
      if (await isUserTableEmpty()) {
        console.log('User table empty')
        return response.status(400).json({
          status: 'error',
          message: 'No users table found/users table empty',
        })
      }

      // Found User by Email
      const userDb = await findUserByEmail(email)
      if (!userDb) {
        return response.status(401).json({
          status: 'error',
          message: 'Email not found in User',
        })
      }

      if (!(await isValidRole(token, userDb.role))) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid token, or token has expired',
        })
      }

      const bddPassword = userDb.password
      if (await bcrypt.compare(newPassword, bddPassword)) {
        return response.status(422).json({
          status: 'error',
          Message: 'The new password is the same the old one',
        })
      } else if (!(await bcrypt.compare(oldPassword, bddPassword))) {
        //Old Password not the same as the one in BDD
        return response.status(401).json({
          status: 'Unauthorized',
          messsage: 'Identification with password is wrong',
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
        message: 'Erreur in users changePassword',
      })
    }
  }
}
