import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import * as XLSX from 'xlsx'
import fs from 'node:fs'
import path from 'node:path'

/**
 * @class DocumentsController
 * @brief Contrôleur pour gérer les opérations liées aux documents.
 *
 * Ce contrôleur fournit des méthodes pour gérer le téléchargement et la gestion des documents.
 */
export default class DocumentsController {
  /**
   * @brief Télécharge un document sur le serveur.
   *
   * Cette méthode traite le téléchargement d'un document, vérifie sa validité,
   * le déplace vers un répertoire spécifique et enregistre son chemin dans la base de données.
   *
   * @param {HttpContext} context - Le contexte HTTP contenant la requête et la réponse.
   * @param {Object} context.request - L'objet de requête HTTP contenant le fichier à télécharger.
   * @param {Object} context.response - L'objet de réponse HTTP utilisé pour renvoyer des réponses au client.
   *
   * @throws {BadRequest} Si aucun document n'est fourni ou si le fichier est invalide.
   * @throws {InternalServerError} En cas d'erreur lors du traitement du téléchargement.
   *
   * @return {Promise<Object>} - Une promesse qui résout un objet JSON contenant le message de succès
   *                             et les détails du document téléchargé ou une erreur en cas d'échec.
   */
  async dropDocument({ request, response }: HttpContext) {
    try {
      const file = request.file('document', {
        extnames: ['docx', 'doc', 'odt', 'xlsx', 'xls', 'pdf', 'txt', 'mdj'], // Extensions autorisées
        size: '10mb', // Taille maximale autorisée
      })

      const { email, documentName } = request.only(['email', 'documentName'])

      // Found User by Email
      const userDb = await db.from('users').where('email', email).select('*').first()
      if (!userDb) {
        return response.status(400).json({
          status: 'error',
          message: 'Email not found',
        })
      }

      if (!file) {
        return response.badRequest({ message: 'No document provided' })
      }
      if (!file.isValid) {
        return response.badRequest({
          message: 'Invalid file',
          errors: file.errors,
        })
      }
      //Path
      const basePath = `/${userDb.id_user}`
      const fileUrl = `${basePath}/${documentName}.${file.extname}`
      // Save to disk
      await file.moveToDisk(fileUrl, {
        name: documentName,
      })
      // Save path in DB
      const savedDocument = await db.table('documents').insert({
        name: file.clientName,
        document_path: fileUrl,
        uploaded_at: new Date(),
      })
      // Retourner une réponse réussie
      return response.created({
        message: 'Document uploaded successfully',
        document: {
          id: savedDocument[0], // ID du fichier inséré (si disponible)
          name: file.clientName,
          document_path: fileUrl,
        },
      })
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in dropDocument',
      })
    }
  }

  /**
   * @brief Importe des utilisateurs à partir d'un fichier Excel ou CSV.
   *
   * Cette méthode traite un fichier Excel ou CSV téléchargé, vérifie chaque ligne,
   * crée de nouveaux utilisateurs si nécessaire, et les associe à leurs maîtres
   * d'apprentissage et tuteurs pédagogiques.
   *
   * @param {HttpContext} context - Le contexte HTTP contenant la requête et la réponse.
   *
   * @throws {BadRequest} Si aucun fichier n'est fourni ou si le fichier est invalide.
   * @throws {InternalServerError} En cas d'erreur lors du traitement du fichier.
   *
   * @return {Promise<Object>} - Une promesse qui résout un objet JSON contenant le résultat de l'importation.
   */
  async importUsers({ request, response }: HttpContext) {
    try {
      const file = request.file('file', {
        extnames: ['xlsx'],
        size: '10mb',
      })

      if (!file || !file.isValid) {
        return response.badRequest({ message: 'Invalid file' })
      }

      const filePath = `${Date.now()}-${file.clientName}`
      const fullPath = path.join(process.cwd(), 'tmp', filePath)
      console.log(`Full path: ${fullPath}`) // Log the full path

      await file.move(process.cwd() + '/tmp', { name: filePath })

      // Vérifier si le fichier a été déplacé avec succès
      if (!fs.existsSync(fullPath)) {
        console.error('File move failed') // Log the error
        return response.badRequest({ message: 'File move failed' })
      }
      XLSX.set_fs(fs)
      // Lecture du fichier Excel
      const workbook = XLSX.readFile(fullPath)
      const sheetName = workbook.SheetNames[0]
      let data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
      const results = []
      console.log(data)
      for (const row of data) {
        const { email, name, last_name, apprenticeMasters, educationalTutors } = row

        // Vérifier si l'utilisateur existe déjà
        let user = await db.from('users').where('email', email).first()

        if (!user) {
          // Créer un nouvel utilisateur
          const role = 'apprentices'
          const result = await db
            .table('users')
            .insert({
              email,
              name,
              last_name,
              role,
            })
            .returning('*') // Récupérer toutes les colonnes

          user = { id_user: result[0], email, name, last_name }
        }

        // Créer un journal de formation (training diary)
        const [trainingDiaryId] = await db
          .table('training_diaries')
          .insert({
            semester_grades: JSON.stringify({}),
            document_list: JSON.stringify([]),
            evaluation: 0,
            list_interview: JSON.stringify([]),
            list_report: JSON.stringify([]),
            list_presentation: JSON.stringify([]),
            createdAt: new Date(),
          })
          .returning('id_training_diary')

        const apprenticeMaster = await db
          .from('users')
          .where('email', apprenticeMasters)
          .where('role', 'apprentice_masters')
          .first()

        // Associer le tuteur pédagogique
        const educationalTutor = await db
          .from('users')
          .where('email', educationalTutors)
          .where('role', 'educational_tutors')
          .first()

        const alreadyCreated = await db.from('apprentices').where('id', user.id_user).first()

        if (!alreadyCreated) {
          // Insérer dans la table apprentices
          console.log(`create new User : ${user.id_user}`)
          await db.table('apprentices').insert({
            id: user.id_user,
            id_educational_tutor: educationalTutor ? educationalTutor.id_user : null,
            id_apprentice_master: apprenticeMaster ? apprenticeMaster.id_user : null,
            id_training_diary: trainingDiaryId,
            listMissions: JSON.stringify([]),
          })
        } else {
          // Mettre à jour l'enregistrement existant
          console.log(`already existing user : ${user.id_user}`)
          await db
            .from('apprentices')
            .where('id', user.id_user)
            .update({
              id_educational_tutor: educationalTutor ? educationalTutor.id_user : null,
              id_apprentice_master: apprenticeMaster ? apprenticeMaster.id_user : null,
              id_training_diary: trainingDiaryId,
            })
        }

        results.push({
          user: user.email,
          status: 'created/updated',
          trainingDiaryId,
        })
      }

      // Supprimer le fichier temporaire
      fs.unlinkSync(`tmp/${filePath}`)

      return response.ok({
        message: 'Users imported successfully',
        results,
      })
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        message: 'An error occurred while importing users',
        error: error.message,
      })
    }
  }
}
