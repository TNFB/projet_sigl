import db from '@adonisjs/lucid/services/db'
import { HttpContext } from '@adonisjs/core/http'
import bcrypt from 'bcrypt'
import { isValidRole } from '../utils/api_utils.js'

export default class ProfessionalsController {
  /**
   * @method createOrUpdateProfessional
   * @description Crée un nouvel utilisateur professionnel ou met à jour un utilisateur existant.
   *
   * @param {HttpContext} context - Le contexte HTTP de la requête.
   *
   * @property {string} name - Le nom de l'utilisateur.
   * @property {string} lastName - Le nom de famille de l'utilisateur.
   * @property {string} email - L'email de l'utilisateur.
   * @property {string} companyName - Le nom de l'entreprise du professionnel.
   *
   * @throws {InternalServerError} En cas d'erreur lors du traitement de la requête.
   *
   * @returns {Promise<Object>} Une promesse qui résout avec un objet JSON contenant un message de succès ou d'erreur.
   */
  async createOrUpdateProfessionals({ request, response }: HttpContext) {
    try {
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { peopleData } = data

      const emailUser = request.user?.email
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

      if (!Array.isArray(peopleData)) {
        return response.status(400).json({ error: 'Input should be an array of people' })
      }

      const results = []

      for (const person of peopleData) {
        const { name, lastName, email, companyName } = person

        // Vérifier si l'entreprise existe, sinon la créer
        let idCompany = 0
        let company = await db.from('companies').where('name', companyName).first()
        if (!company) {
          const newIdCompany = await db
            .table('companies')
            .insert({ name: companyName })
            .returning('idCompany')
          idCompany = newIdCompany[0]
        } else {
          idCompany = company.idCompany
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await db.from('users').where('email', email).first()

        if (existingUser) {
          // Mettre à jour les informations de l'utilisateur existant
          await db.from('users').where('email', email).update({ name, lastName })

          // Vérifier si l'entrée existe dans professionals
          const existingMaster = await db
            .from('professionals')
            .where('id', existingUser.id_user)
            .first()

          if (existingMaster) {
            // Mettre à jour l'entrée dans professionals si nécessaire
            await db
              .from('professionals')
              .where('id', existingUser.id_user)
              .update({ idCompany: idCompany })
          } else {
            // Créer une nouvelle entrée dans professionals si elle n'existe pas
            await db.table('professionals').insert({
              id: existingUser.id_user,
              idCompany: idCompany,
            })
          }

          results.push({
            email,
            status: 'updated',
            userId: existingUser.id_user,
            compagnyId: idCompany,
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
              role: 'professionals',
            })
            .returning('id_user')

          // Créer l'entrée dans la table professionals
          await db.table('professionals').insert({
            id: userId,
            idCompany: idCompany,
          })

          // Vous devriez envoyer le mot de passe par email à l'utilisateur ici
          console.log(`Mot de passe généré pour ${email}: ${password}`)

          results.push({ email, status: 'created', userId, compagnyId: idCompany })
        }
      }

      return response.status(200).json({
        message: 'Apprentice masters processed successfully',
        results: results,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        error: 'An error occurred while processing professionals',
      })
    }
  }
}
