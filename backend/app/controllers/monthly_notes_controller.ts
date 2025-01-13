import { findUserByEmail } from '../utils/api_utils.js'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class MonthlyNotesController {
  // Fonction pour récupérer toutes les notes
  public async getAllNotes({ request, response }: HttpContext) {
    try {
      const emailUser = (request as any).user?.email
      if (!emailUser) {
        return response.status(401).json({ error: 'Unauthorized' })
      }

      // Trouver l'utilisateur par email
      const user = await findUserByEmail(emailUser)
      if (!user) {
        return response.notFound({ message: 'Error User Not found' })
      }

      // Récupérer les notes mensuelles liées à l'utilisateur via le training_diary
      const notes = await db.from('monthly_notes')
        .join('training_diaries', 'monthly_notes.id_training_diary', 'training_diaries.id_training_diary')
        .join('apprentices', 'training_diaries.id_training_diary', 'apprentices.id_training_diary')
        .where('apprentices.id', user.id_user)
        .select('monthly_notes.*')

      return response.ok({ notes });
        
    } catch (error) {
      console.error('Error fetching notes:', error);
      return response.internalServerError({ message: 'An error occurred while fetching notes' });
    }
  }

  public async createNote({ request, response }: HttpContext) {
    try {
      const { data } = request.only(['data'])
      if (!data) {
        return response.status(400).json({ error: 'Data is required' })
      }
      const { title, content } = data
  
      // Récupérer l'email de l'utilisateur
      const emailUser = (request as any).user?.email
      if (!emailUser) {
        return response.status(401).json({ error: 'Unauthorized' })
      }
  
      // Trouver l'utilisateur par email
      const user = await findUserByEmail(emailUser)
      if (!user) {
        return response.status(404).json({ message: 'User not found' })
      }
  
      // Récupérer l'ID du journal de formation associé à l'utilisateur
      const trainingDiary = await db
        .from('training_diaries')
        .join('apprentices', 'training_diaries.id_training_diary', 'apprentices.id_training_diary')
        .where('apprentices.id', user.id_user)
        .select('training_diaries.id_training_diary')
        .first()
  
      if (!trainingDiary) {
        return response.status(404).json({ message: 'Training diary not found for the user' })
      }
  
      const { id_training_diary } = trainingDiary
  
      // Créer la note
      const [newNoteId] = await db.table('monthly_notes').insert({
        id_training_diary,
        title,
        content,
      }).returning('id_monthly_note')
  
      const newNote = await db.from('monthly_notes').where('id_monthly_note', newNoteId).first()
  
      return response.status(201).json({ message: 'Note created successfully', note: newNote })
    } catch (error) {
      console.error('Error creating note:', error)
      return response.status(500).json({ message: 'An error occurred while creating the note' })
    }
  }


  // Fonction pour modifier une note
  public async updateNote({ request, response }: HttpContext) {
    try {
      const { data } = request.only(['data']);
      if (!data) {
        return response.status(400).json({ error: 'Data is required' });
      }
      const { id_monthly_note, title, content } = data;
      const updatedRows = await db.from('monthly_notes')
        .where('id_monthly_note', id_monthly_note)
        .update({ title, content });
      if (updatedRows.length === 0) {
        return response.notFound({ message: 'Note not found' });
      }

      const updatedNote = await db.from('monthly_notes').where('id_monthly_note', id_monthly_note).first();

      return response.ok({ message: 'Note updated successfully', note: updatedNote });
    } catch (error) {
        console.error('Error updating note:', error);
        return response.internalServerError({ message: 'An error occurred while updating the note' });
    }
  }

  // Fonction pour supprimer une note
  public async deleteNote({ request, response }: HttpContext) {
    try {
        const { data } = request.only(['data']);
        if (!data) {
          return response.status(400).json({ error: 'Data is required' });
        }
        const { id_monthly_note } = data;

        const deletedRows = await db.from('monthly_notes').where('id_monthly_note', id_monthly_note).delete();

        if (deletedRows.length === 0) {
          return response.notFound({ message: 'Note not found' });
        }

        return response.ok({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Error deleting note:', error);
      return response.internalServerError({ message: 'An error occurred while deleting the note' });
    }
  }
}
