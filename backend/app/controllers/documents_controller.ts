import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import * as XLSX from 'xlsx'
import fs from 'node:fs'
import path from 'node:path'
import { createApprenticeWithTrainingDiary, findOrCreateApprenticeMaster, findOrCreateCursus, findOrCreateEducationalTutor, findUserByEmail, generatePassword, getOrCreateCompanyIdByName } from '../utils/api_utils.js'
import bcrypt from 'bcrypt'

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
    console.log('Drop Document')
    try {
      const file = request.file('document', {
        extnames: ['docx', 'doc', 'odt', 'xlsx', 'xls', 'pdf', 'txt'], // Extensions autorisées
        size: '10mb', // Taille maximale autorisée
      })

      const jsonData = request.input('data')
      let data
      try {
        data = JSON.parse(jsonData)
      } catch (error) {
        return response.status(400).json({ error: 'Invalid JSON data' })
      }

      const { documentName } = data

      // Found User by Email
      const emailUser = (request as any).user?.email
      if (!emailUser) {
        return response.status(401).json({ error: 'Unauthorized' })
      }
      const userDb = await findUserByEmail(emailUser)
      if (!userDb) {
        return response.notFound({
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
      console.log(`fileUrl: ${fileUrl}`)

      // Vérifier si le document existe déjà
      const existingDocument = await db
        .from('documents')
        .where('name', documentName)
        .first()

      if (existingDocument) {
        if (existingDocument.document_path !== fileUrl) {
          //Remove to disk
          const storagePath = process.env.STORAGE_PATH;
          const fileToDelete = path.join(storagePath ?? '', existingDocument.document_path);
          fs.unlink(fileToDelete, (err) => {
            if (err) {
              console.error('Erreur lors de la suppression du fichier (vérifier ENV):', err);
            } else {
              console.log('Fichier supprimé avec succès');
            }
          });
          
          await db.from('documents')
            .where('id_document', existingDocument.id_document)
            .update({
              document_path: fileUrl,
              uploaded_at: new Date()
            })
        } else {
          return response.ok({
            message: 'Document already exists (update doc)',
            document: existingDocument,
          })
        }
        console.log('Le document existais déjà (update)')
      } else {
        // Nouveau document, insérer dans la DB
        await db.table('documents').insert({
          name: documentName,
          document_path: fileUrl,
          uploaded_at: new Date(),
        })
        console.log('Nouveau document inséré (BDD)')
      }
      console.log('Befor Move To Disk')
      try {
        // Déplacer le fichier une seule fois, après avoir mis à jour ou inséré dans la DB
        await file.moveToDisk(fileUrl, {
          name: documentName,
        })
        console.log('Move document (Disk)')  
      } catch ( error ) {
        console.error('Erreur lors du déplacement du fichier:', error)
      }
      
      
      // Retourner une réponse réussie
      return response.created({
        message: existingDocument ? 'Document updated successfully' : 'Document uploaded successfully',
        document: {
          name: documentName,
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
    console.log('import user via Excel')
    try {
      const file = request.file('file', {
        extnames: ['xlsx'],
        size: '10mb',
      })

      if (!file || !file.isValid) {
        return response.badRequest({ message: 'Invalid file' })
      }

      const filePath = `${Date.now()}_${file.clientName}`
      const fullPath = path.join(process.cwd(), 'tmp', filePath)
      //console.log(`Full path: ${fullPath}`) // Log the full path

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
        const { email_apprentice, name_apprentice, last_name_aprentice, telephone_apprentice, cursus, email_educational_tutors, email_apprentice_masters, name_apprentice_masters, last_name_apprentice_masters, telephone_apprentice_masters, company_name } = row

        //Get or Create Company ID
        let company_id = await getOrCreateCompanyIdByName(company_name);
        
        //Get or Create Cursus ID
        let cursusId = await findOrCreateCursus(cursus);

        // Vérifier si l'aprpenti existe déjà
        let apprentice = await findUserByEmail(email_apprentice)

        if (!apprentice) { // Aprpenti n'existe pas
          // Créer un nouvel user => apprenti
          const role = 'apprentices'
          const password = await generatePassword()
          console.log(`Apprentice Email : ${email_apprentice} & password: ${password}`)
          const [newUserId] = await db
            .table('users')
            .insert({
              email: email_apprentice,
              password: await bcrypt.hash(password, 10),
              name: name_apprentice,
              last_name: last_name_aprentice,
              telephone: telephone_apprentice,
              role: role,
            })
            .returning('id_user')
            apprentice = {
              id_user: newUserId,
              email: email_apprentice,
              role: role,
              password: password,
              name: name_apprentice,
              last_name: last_name_aprentice,
              telephone: telephone_apprentice
            };
        }

        const educationalTutor = await findOrCreateEducationalTutor(email_educational_tutors) // Return ID

        const apprenticeMaster = await findOrCreateApprenticeMaster(
          email_apprentice_masters,
          name_apprentice_masters,
          last_name_apprentice_masters,
          telephone_apprentice_masters,
          company_id
        );

        // Créer l'apprenti avec son journal de formation
        await createApprenticeWithTrainingDiary(
          apprentice.id_user,
          educationalTutor.id_user,
          apprenticeMaster.id_user,
          company_id,
          cursusId
        );

        results.push({
          apprentice: {
            email: email_apprentice,
            id: apprentice.id_user
          },
          educationalTutor: {
            email: email_educational_tutors,
            id: educationalTutor.id_user
          },
          apprenticeMaster: {
            email: email_apprentice_masters,
            id: apprenticeMaster.id_user
          },
          company: {
            name: company_name,
            id: company_id
          },
          cursus: {
            name: cursus,
            id: cursusId
          },
          status: 'created/updated'
        });
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
