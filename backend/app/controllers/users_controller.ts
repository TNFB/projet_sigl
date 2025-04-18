import db from '@adonisjs/lucid/services/db'
import { HttpContext } from '@adonisjs/core/http'
import bcrypt from 'bcrypt'
import { findUserByEmail, isUserTableEmpty, isValidRole } from '../utils/api_utils.js'
import jwt from 'jsonwebtoken'
import User from '#models/user'
import { sendEmailToUser } from '../utils/email_utils.js'

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
    try {
      // Récupérer le rôle depuis les paramètres de la requête
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }

      const role = data.role
      const detailed = data.detailed

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

      // Vérifier si la table 'users' est vide
      if (await isUserTableEmpty()) {
        console.log('User table empty')
        return response.status(400).json({
          status: 'error',
          message: 'No users table found/users table empty',
        })
      }

      // Préparer la requête
      let query = db.from('users')

      // Si un rôle est spécifié, filtrer par ce rôle
      if (role) {
        query = query.where('role', role)
      }

      // Sélectionner les colonnes en fonction du paramètre 'detailed'
      if (detailed === 'true') {
        query = query
          .leftJoin('apprentices', 'users.id_user', 'apprentices.id')
          .leftJoin('cursus', 'apprentices.id_cursus', 'cursus.id_cursus')
          .select('users.id_user', 'users.email', 'users.name', 'users.last_name', 'users.role', 'cursus.promotion_name', 'users.telephone')
      } else {
        query = query.select('email')
      }

      // Exécuter la requête
      const users = await query

      if (detailed === 'true') {
        return response.status(200).json({
          status: 'success',
          users: users,
        })
      } else {
        const emails = users.map((user: User) => user.email)
        return response.status(200).json({
          status: 'success',
          emails: emails,
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur dans getUserEmailsByRole',
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
      const { email, name, last_name, role, company, promotion, telephone } = data

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

      //Check if Email Existe
      const emailDB = await db.from('users').where('email', email).count('* as total')
      if (emailDB[0].total > 0) {
        return response.status(400).json({
          status: 'error',
          message: `email: ${email} already existe in DB`,
        })
      }

      //Create User
      const password = this.generateRandomPassword()
      const hashedPassword = await bcrypt.hash(password, 10)
      const createUser = await db
        .table('users')
        .insert({ email, password: hashedPassword, name, last_name, role, telephone })

      switch (role) {
        case 'admins':
        case 'educational_tutors':
        case 'teachers':
          await db.table(role).insert({ id: createUser })
          break
        case 'apprentice_masters':
        case 'professionals':
          // Vérifier si la company existe déjà
          const [existingCompany] = await db
            .from('companies')
            .where('name', company)
            .select('id_company')
          
          let companyId
          if (existingCompany) {
            companyId = existingCompany.id
          } else {
            // Créer la company si elle n'existe pas
            const [newCompanyId] = await db.table('companies').insert({ name: company }).returning('id_company')
            companyId = newCompanyId
          }

          // Insérer l'id de l'utilisateur et l'id de la company dans la table correspondante
          await db.table(role).insert({ id: createUser, id_company: companyId })
          break
        case 'apprentices':
          // Récupérer l'id de la promotion dans la table cursus
          const [cursus] = await db
            .from('cursus')
            .where('promotion_name', promotion)
            .select('id_cursus')

          if (!cursus) {
            return response.status(400).json({
              status: 'error',
              message: 'Invalid promotion',
            })
          }

          let promotionId = cursus.id_cursus
          const [newTrainingDiaryId] = await db.table('training_diaries').insert({
            semester_grades: JSON.stringify({}),
            document_list: JSON.stringify([]),
            evaluation: 0,
            list_interview: JSON.stringify([]),
            list_report: JSON.stringify([]),
            list_presentation: JSON.stringify([]),
            created_at: new Date()
          }).returning('id_training_diary')

          // Insérer l'id de l'utilisateur et l'id de la promotion dans la table correspondante
          await db.table(role).insert({ id: createUser, id_cursus: promotionId, id_training_diary: newTrainingDiaryId })
          break
        default:
          return response.status(400).json({
            status: 'error',
            message: 'Invalid role',
          })
      }

      // Envoyer un email à l'utilisateur avec ses identifiants de connexion
      const emailContent = `Bonjour ${name} ${last_name},\n\nVotre compte alternant ESEO a été créé.\n\nVoici vos identifiants de connexion :\nEmail : ${email}\nMot de passe : ${password}\n\nVeuillez vous connecter et changer votre mot de passe dès que possible :\nhttps://journal-formation.francecentral.cloudapp.azure.com/Login/\n\nCordialement,\nL'équipe`
      await sendEmailToUser(email, 'Bienvenue sur notre plateforme', emailContent)

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
        return response.notFound({
          message: 'Email not found in User',
        })
      }
      const isPasswordValid = await bcrypt.compare(password, userDb.password)
      if (isPasswordValid) {
        const token = jwt.sign(
          { id: userDb.id_user, email: userDb.email, role: userDb.role },
          process.env.APP_KEY || 'default_secret_key',
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

  async changePassword({ request, response }: HttpContext) {
    try {
      const emailUser = (request as any).user?.email
      if (!emailUser) {
        return response.status(401).json({ error: 'Unauthorized' })
      }
  
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
  
      const { oldPassword, newPassword } = data
      if (!oldPassword || !newPassword) {
        return response.status(400).json({
          status: 'error',
          message: 'Old password and new password are required',
        })
      }
  
      // Récupérer l'utilisateur
      const user = await db.from('users').where('email', emailUser).first()
      if (!user) {
        return response.notFound({
          message: 'User not found',
        })
      }

      // Vérifier l'ancien mot de passe
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
      if (!isPasswordValid) {
        return response.status(400).json({
          status: 'error',
          message: 'Ancien mot de passe incorrect',
        })
      }

      // Vérifier que le nouveau mot de passe est différent de l'ancien
      const isNewPasswordSameAsOld = await bcrypt.compare(newPassword, user.password)
      if (isNewPasswordSameAsOld) {
        return response.status(400).json({
          status: 'error',
          message: 'Le nouveau mot de passe doit être différent de lancien',
        })
      }
  
      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10)
  
      // Mettre à jour le mot de passe
      await db.from('users').where('email', emailUser).update({ password: hashedPassword })
  
      return response.status(200).json({
        status: 'success',
        message: 'Mot de passe changé avec succès',
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in users changePassword',
      })
    }
  }
  

  async getUserInfoByEmail({ request, response }: HttpContext) {
    console.log('getUserInfoByEmail')
    try {
      const emailUser = (request as any).user.email
      if (!emailUser) {
        return response.status(401).json({ error: 'Unauthorized' })
      }

      const userDb = await findUserByEmail(emailUser)

      if (!userDb) {
        return response.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      return response.status(200).json({
        status: 'succes',
        message: 'password changed succesfully',
        userInfo: userDb
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in users getUserInfoByEmail',
      })
    }
  }

  async updateUser({ request, response }: HttpContext) {
    console.log('updateUser')
    try {
      const emailUser = (request as any).user?.email
      if (!emailUser) {
        return response.status(401).json({ error: 'Unauthorized' })
      }
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }

      // Vérifier si la table 'users' est vide
      if (await isUserTableEmpty()) {
        console.log('User table empty')
        return response.status(400).json({
          status: 'error',
          message: 'No users table found/users table empty',
        })
      }
      // Extraire les données de la requête
      const { email, name, last_name, telephone } = data;
      console.log('email', email, 'name', name, 'last_name', last_name, 'telephone', telephone)
      // Vous pouvez ajouter des validations ici si nécessaire
      if (!email || !name || !last_name || !telephone) {
        return response.status(400).json({ error: 'Tous les champs sont requis.' });
      }

      // Trouver l'utilisateur dans la base de données par email
      const userDb = await findUserByEmail(emailUser);
      if (!userDb) {
        return response.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      await db.from('users')
      .where('email', email)
      .update({ 
        email: email,
        name: name,
        last_name: last_name,
        telephone: telephone
       });

      // Générer un nouveau token JWT avec le nouvel email
      const newToken = jwt.sign(
        { id: userDb.id_user, email: email, role: userDb.role },
        process.env.APP_KEY || 'default_secret_key',
        {
          expiresIn: '1h',
        }
      )
      const updatedUser = await findUserByEmail(email);

      return response.status(200).json({
          status: 'success',
          message: 'Informations utilisateur mises à jour avec succès.',
          userInfo: updatedUser,
          token: newToken
      });

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in users updateUser',
      })
    }
  }

  async checkEmailExists({ request, response }: HttpContext) {
    try {
      // Récupérer l'email depuis la requête
      const emailUser = (request as any).user?.email
      if (!emailUser) {
        return response.status(401).json({ error: 'Unauthorized' })
      }
  
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }

      const { email } = data
      if (!email) {
        return response.status(400).json({
          status: 'error',
          message: 'Email is required',
        })
      }
  
      // Vérifier si l'email existe dans la base de données
      const user = await db.from('users').where('email', email).first()
  
      // Renvoyer la réponse
      return response.status(200).json({
        status: 'success',
        exists: !!user,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in users checkEmailExists',
      })
    }
  }

  async getRole({ request, response }: HttpContext) {
    console.log('getRole')
    try {
      // Récupérer l'email de l'utilisateur à partir du token JWT
      const userEmail = (request as any).user?.email

      if (!userEmail) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      // Rechercher l'utilisateur dans la base de données
      const user = await db.from('users').where('email', userEmail).select('role').first()

      if (!user) {
        return response.notFound({ message: 'User not found' })
      }

      // Retourner le rôle de l'utilisateur
      return response.ok({ role: user.role })
    } catch (error) {
      console.error('Error fetching user role:', error)
      return response.internalServerError({ message: 'An error occurred while fetching the user role' })
    }
  }

  async sendEmail({ request, response }: HttpContext) {
    try {
      const { email, subject, content } = request.only(['email', 'subject', 'content'])

      if (!email || !subject || !content) {
        return response.status(400).json({ error: 'Email, subject, and content are required' })
      }

      await sendEmailToUser(email, subject, content)

      return response.status(200).json({ message: 'Email sent successfully' })
    } catch (error) {
      console.error('Error sending email:', error)
      return response.status(500).json({ error: 'Error sending email' })
    }
  }
}
