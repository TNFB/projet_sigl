import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class TrainingDiariesController {
  /*
    async getSemesterGrade({ request, response }: HttpContext) {
        //
    }

    async getDocuments({ request, response }: HttpContext) {
        //
    }

    async getGrades({ request, response }: HttpContext) {
        //
    }

    async getCalendar({ request, response }: HttpContext) {
        //
    }
    */

  async createTraningDiary({ request, response }: HttpContext) {
    console.log('createTraningDiary')
    try {
      const { idUser } = request.only(['idUser'])
      const user = await db.from('users').where('idUser', idUser).first()
      if (user && user.role === 'apprentices') {
        const newTrainingDiary = await db.table('training_diaries').insert({
          createdAt: new Date(),
        })

        await db
          .from('apprentices')
          .where('id', idUser)
          .update({ idTrainingDiary: newTrainingDiary })

        return response.status(200).json({
          message: 'Training Diary created',
          trainingDiaryId: newTrainingDiary,
        })
      } else {
        return response.status(403).json({
          message: 'user not found or not authorised',
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erreur in createTraningDiary',
      })
    }
  }
}
