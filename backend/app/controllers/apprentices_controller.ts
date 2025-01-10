import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class ApprenticesController {
  public async getInfoApprentice({ request, response }: HttpContext) {
    const emailUser = (request as any).user?.email;
    const { data } = request.only(['data']);
    
    if (!data) {
        return response.status(400).json({ error: 'Data is required' });
    }
    
    const { id } = data;
    try {
      const student = await db.from('users')
        .where('id_user', id)
        .where('role', 'apprentices')
        .select('email', 'name', 'last_name')
        .first();
      if (!student) {
        return response.notFound({ message: 'Student not found' })
      }

      const user = await db.from('users').where('email', emailUser).first()
      if (!user) {
          return response.unauthorized({ message: 'User not found' })
      }

      let isAuthorized = false

      // Vérifiez si l'utilisateur est un maître d'apprentissage ou un tuteur pédagogique
      if (user.role === 'apprentice_masters') {
          isAuthorized = await db.from('apprentices')
          .where('id', id)
          .where('id_apprentice_master', user.id_user)
          .first()
      } else if (user.role === 'educational_tutors') {
          isAuthorized = await db.from('apprentices')
          .where('id', id)
          .where('id_educational_tutor', user.id_user)
          .first()
      }

      if (!isAuthorized) {
        return response.forbidden({ message: 'Access denied' })
      }
      return response.ok(student)
    } catch (error) {
      console.error('Error fetching student info:', error)
      return response.internalServerError({ message: 'An error occurred while fetching student information' })
    }
  }
}
