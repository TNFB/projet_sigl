import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class DocumentsController {
  /*
    async getDocument({ request, response }: HttpContext) {
        //
    }
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
