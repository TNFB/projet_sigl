import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import bcrypt from 'bcrypt'

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
  async createOrUpdateProfessional({ request, response }: HttpContext) {
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

        // Mettre à jour l'entrée dans professionals si nécessaire
        await db
          .from('professionals')
          .where('id', existingUser.idUser)
          .update({ idCompagny: idCompagny })

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
            role: 'professionals',
          })
          .returning('idUser')

        // Créer l'entrée dans la table professionals
        await db.table('professionals').insert({
          id: userId,
          idCompagny: idCompagny,
        })

        // Vous devriez envoyer le mot de passe par email à l'utilisateur ici
        console.log(`Mot de passe généré pour ${email}: ${password}`)

        return response.status(201).json({ message: 'professionals created successfully', userId })
      }
    } catch (error) {
      console.error(error)
      return response
        .status(500)
        .json({ error: 'An error occurred while creating or updating the user: professionals' })
    }
  }
}
