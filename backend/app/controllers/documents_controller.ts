import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

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
      console.log('Drop Document')
      const file = request.file('document', {
        extnames: ['docx', 'doc', 'odt', 'xlsx', 'xls', 'pdf', 'txt', 'mdj'], // Extensions autorisées
        size: '10mb', // Taille maximale autorisée
      })
      if (!file) {
        return response.badRequest({ message: 'No document provided' })
      }
      if (!file.isValid) {
        return response.badRequest({
          message: 'Invalid file',
          errors: file.errors,
        })
      }
      //Name Doc
      const fileName = `${Date.now()}-${file.clientName}`
      //Path
      const basePath = '/hereIdOfUser' // Here Path (add path to unique folder)
      const fileUrl = `${basePath}/${fileName}`
      // Save to disk
      await file.moveToDisk(fileUrl, {
        name: fileName,
      })
      // Save path in DB
      const savedDocument = await db.table('documents').insert({
        name: file.clientName,
        documentPath: fileUrl,
        uploadedAt: new Date(),
      })
      // Retourner une réponse réussie
      return response.created({
        message: 'Document uploaded successfully',
        document: {
          id: savedDocument[0], // ID du fichier inséré (si disponible)
          name: file.clientName,
          documentPath: fileUrl,
        },
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in dropDocument',
      })
    }
  }
}
