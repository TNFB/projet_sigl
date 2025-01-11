import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class ApprenticesController {
  public async getInfoApprentice({ request, response }: HttpContext) {
    console.log('getInfoApprentice')
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
          return response.notFound({ message: 'User not found' })
      }

      let isAuthorized = false
      let apprenticeInfo = null

      // Vérifiez si l'utilisateur est un maître d'apprentissage ou un tuteur pédagogique
      if (user.role === 'apprentice_masters') {
          apprenticeInfo = await db.from('apprentices')
            .where('id', id)
            .where('id_apprentice_master', user.id_user)
            .select('list_missions')
            .first()
          isAuthorized = !!apprenticeInfo
      } else if (user.role === 'educational_tutors') {
          apprenticeInfo = await db.from('apprentices')
            .where('id', id)
            .where('id_educational_tutor', user.id_user)
            .select('list_missions')
            .first()
          isAuthorized = !!apprenticeInfo
      }

      if (!isAuthorized) {
        return response.forbidden({ message: 'Access denied' })
      }

      // Combine student info with apprentice info
      const combinedInfo = {
        ...student,
        list_missions: apprenticeInfo ? apprenticeInfo.list_missions : null
      }
      return response.ok(combinedInfo)
    } catch (error) {
      console.error('Error fetching student info:', error)
      return response.internalServerError({ message: 'An error occurred while fetching student information' })
    }
  }

  public async addMission({ request, response }: HttpContext) {
    console.log('addMission')
    const { data } = request.only(['data'])
    const { id, mission } = data

    try {
        const apprentice = await db.from('apprentices').where('id', id).first()
        if (!apprentice) {
            return response.notFound({ message: 'Apprentice not found' })
        }

        let missions = []

        if (apprentice.list_missions) {
            try {
                // Vérifiez si list_missions est une chaîne avant de tenter de la parser
                if (typeof apprentice.list_missions === 'string') {
                    missions = JSON.parse(apprentice.list_missions);
                } else if (Array.isArray(apprentice.list_missions)) {
                  missions = apprentice.list_missions;
                }
            } catch (parseError) {
                console.error('Error parsing list_missions:', parseError);
            }
        }

        const newMission = {
            id: Date.now(),
            ...mission
        }
        missions.push(newMission)

        await db.from('apprentices')
            .where('id', id)
            .update({ list_missions: JSON.stringify(missions) })

        return response.ok({ message: 'Mission added successfully', mission: newMission })
    } catch (error) {
        console.error('Error adding mission:', error)
        return response.internalServerError({ message: 'An error occurred while adding the mission' })
    }
  }

  public async updateMission({ request, response }: HttpContext) {
    console.log('updateMission');
    const { data } = request.only(['data']);
    const { id, mission } = data;

    try {
      const apprentice = await db.from('apprentices').where('id', id).first();
      if (!apprentice) {
          return response.notFound({ message: 'Apprentice not found' });
      }

      let missions = [];
      console.log('Current list_missions:', apprentice.list_missions); // Log pour déboguer

      if (apprentice.list_missions) {
          try {
              // Vérifiez si list_missions est une chaîne avant de tenter de la parser
              if (typeof apprentice.list_missions === 'string') {
                  missions = JSON.parse(apprentice.list_missions);
              } else if (Array.isArray(apprentice.list_missions)) {
                  missions = apprentice.list_missions; // Si c'est déjà un tableau
              }
          } catch (parseError) {
              console.error('Error parsing list_missions:', parseError);
              return response.internalServerError({ message: 'Invalid format for list_missions' });
          }
      }

      const index = missions.findIndex((m: any) => m.id === mission.id);
      if (index === -1) {
          return response.notFound({ message: 'Mission not found' });
      }

      // Mettre à jour uniquement les champs nécessaires
      missions[index] = { ...missions[index], ...mission };

      // Mettre à jour la base de données avec la liste mise à jour des missions
      await db.from('apprentices')
          .where('id', id)
          .update({ list_missions: JSON.stringify(missions) });

      return response.ok({ message: 'Mission updated successfully', mission: missions[index] });
    } catch (error) {
        console.error('Error updating mission:', error);
        return response.internalServerError({ message: 'An error occurred while updating the mission' });
    }
  }

  public async deleteMission({ request, response }: HttpContext) {
    console.log('deleteMission');
    const { data } = request.only(['data']);
    const { id, missionId } = data;

    try {
        const apprentice = await db.from('apprentices').where('id', id).first();
        if (!apprentice) {
            return response.notFound({ message: 'Apprentice not found' });
        }

        let missions = [];
        console.log('Current list_missions:', apprentice.list_missions); // Log pour déboguer

        if (apprentice.list_missions) {
            try {
                // Vérifiez si list_missions est une chaîne avant de tenter de la parser
                if (typeof apprentice.list_missions === 'string') {
                    missions = JSON.parse(apprentice.list_missions);
                } else if (Array.isArray(apprentice.list_missions)) {
                    missions = apprentice.list_missions; // Si c'est déjà un tableau
                }
            } catch (parseError) {
                console.error('Error parsing list_missions:', parseError);
                return response.internalServerError({ message: 'Invalid format for list_missions' });
            }
        }

        // Filtrer les missions pour supprimer celle avec l'ID spécifié
        const updatedMissions = missions.filter((m: any) => m.id !== missionId);
        
        // Mettre à jour la base de données avec la liste mise à jour des missions
        await db.from('apprentices')
            .where('id', id)
            .update({ list_missions: JSON.stringify(updatedMissions) });

        return response.ok({ message: 'Mission deleted successfully' });
    } catch (error) {
        console.error('Error deleting mission:', error);
        return response.internalServerError({ message: 'An error occurred while deleting the mission' });
    }
}
}
