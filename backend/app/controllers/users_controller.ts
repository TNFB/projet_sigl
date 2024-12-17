import db from '@adonisjs/lucid/services/db'
import { HttpContext } from '@adonisjs/core/http'
import bcrypt from 'bcrypt'

/**
 * @class UsersController
 * @brief Contrôleur pour gérer les utilisateurs.
 *
 * Ce contrôleur fournit des méthodes pour créer, récupérer et gérer les utilisateurs dans l'application.
 */
export default class UsersController {
  /**
   * @brief Récupère un utilisateur par son identifiant.
   *
   * Cette méthode vérifie si la table des utilisateurs est vide, puis tente de récupérer un utilisateur
   * en fonction de l'identifiant fourni dans les paramètres. Si l'utilisateur est trouvé, il renvoie ses détails.
   *
   * @param {HttpContext} context - Le contexte HTTP contenant les paramètres et la réponse.
   * @param {Object} context.params - Les paramètres de la requête, y compris l'identifiant de l'utilisateur.
   * @param {Object} context.response - L'objet de réponse HTTP utilisé pour renvoyer des réponses au client.
   *
   * @throws {NotFound} Si la table des utilisateurs est vide ou si l'utilisateur n'est pas trouvé.
   * @throws {InternalServerError} En cas d'erreur lors du traitement de la récupération de l'utilisateur.
   *
   * @return {Promise<Object>} - Une promesse qui résout un objet JSON contenant le statut et les détails de l'utilisateur.
   */
  async getUserById({ params, response }: HttpContext) {
    console.log('getUserById')
    try {
      // check if table 'users' empty
      const acteurCount = await db.from('users').count('* as total')
      if (acteurCount[0].total === 0) {
        console.log('User table empty')
        return response.status(404).json({
          status: 'error',
          message: 'No users table found/users table empty',
        })
      }
      //Table Not Empty
      const getUserById = await db.from('users').where('id', params.id).select('*').first()
      if (getUserById !== null) {
        return response.status(200).json({
          status: 'success',
          users: getUserById,
        })
      } else {
        return response.status(404).json({
          status: 'error',
          message: 'No users table found',
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in getUserByID',
      })
    }
  }

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
  async getUserEmails({ request, response }: HttpContext) {
    console.log('getUserEmails')
    try {
      // Récupérer le rôle depuis les paramètres de la requête
      const role = request.input('role')

      // Vérifier si la table 'users' est vide
      const userCount = await db.from('users').count('* as total')
      if (userCount[0].total === 0) {
        console.log('User table empty')
        return response.status(404).json({
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
        message: 'Erreur dans getUserEmails',
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
      const { email, password, name, lastName, telephone, role } = request.only([
        'email',
        'password',
        'name',
        'lastName',
        'telephone',
        'role',
      ])

      const getEmail = await db.from('users').where('email', email).count('* as total')
      if (getEmail[0].total > 0) {
        return response.status(400).json({
          status: 'error',
          message: `email: ${email} already existe in DB`,
        })
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      const createUser = await db
        .table('users')
        .insert({ email, password: hashedPassword, name, lastName, telephone, role })
      console.log(`User created: ${createUser}`)

      //assigne Role
      let id = createUser
      console.log('role', role)
      // eslint-disable-next-line eqeqeq
      if (role != null) {
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
      const { email, password } = data

      console.log(`email: ${email}`)
      console.log(`password: ${password}`)

      // check if table 'users' empty
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
        return response.status(401).json({
          status: 'error',
          message: 'Email not found',
        })
      }

      const isPasswordValid = await bcrypt.compare(password, userDb.password)
      //const isPasswordValid = password
      if (isPasswordValid) {
        // Creation Token
        const token = `${userDb.idUser}_${Date.now()}`
        response.cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Utilisez true en production avec HTTPS
          maxAge: 2 * 60 * 60 * 1000, // 2 heures en millisecondes
        })
        return response.status(200).json({
          status: 'success',
          password: true,
          role: userDb.role,
          cookieToken: token,
        })
      } else {
        return response.status(401).json({
          status: 'error',
          password: false,
          message: 'password incorrect',
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in users connetion',
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
  async logoutUser({ response }: HttpContext) {
    response.clearCookie('access_token')
    return response.status(200).json({
      status: 'success',
      message: 'Logout succesfull',
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
      const { email, oldPassword, newPassword } = request.only([
        'email',
        'oldPassword',
        'newPassword',
      ])

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
      console.log(`Oldpassword : ${oldPassword}`)
      if (bddPassword === newPassword) {
        return response.status(422).json({
          status: 'error',
          Message: 'The new password is the same the old one',
        })
      } else if (bddPassword !== oldPassword) {
        // Not same user (wrong password)
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
