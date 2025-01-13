import { findUserByEmail } from '../utils/api_utils.js'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class EventsController {
    public async getEvents({ request, response }: HttpContext) {
        console.log(`getEvent`)
        try {
            const emailUser = (request as any).user?.email
            if (!emailUser) {
                return response.status(401).json({ error: 'Unauthorized' })
            }
            const user = await findUserByEmail(emailUser)
            if (!user) {
                return response.notFound({ message: 'Error User Not found' })
            }
    
            let query = db.from('events').where('id_user', user.id_user)
    
            const data = request.input('data')
            if (data) {
                const { event_id } = JSON.parse(data)
                if (event_id) {
                    query = query.where('id_event', event_id)
                }
            }
    
            const events = await query.select('id_event', 'start_date', 'end_date', 'title', 'type', 'color', 'location', 'description');
    
            if (data && JSON.parse(data).event_id && events.length === 0) {
                return response.notFound({ message: 'Event not found' })
            }
            console.log(`getEvent => OK`)
            return response.ok({
                events: data && JSON.parse(data).event_id ? events[0] : events,
                message: data && JSON.parse(data).event_id ? 'Event retrieved successfully' : 'Events retrieved successfully',
            })
        } catch (error) {
            console.error('Error fetching events:', error)
            return response.internalServerError({ message: 'An error occurred while fetching events' })
        }
    }

    public async deleteEvent({ request, response }: HttpContext) {
        console.log(`DeleteEvent`);
        try {
          const { data } = request.only(['data']);
          if (!data) {
            return response.status(400).json({ error: 'Data is required' });
          }
          
          const { id_event } = data;
          console.log(`Attempting to delete event with ID: ${id_event}`);
      
          const deletedRows = await db.from('events').where('id_event', id_event).delete();
      
          if (deletedRows.length === 0) { 
            return response.notFound({ message: 'Event not found' });
          }
      
          console.log(`delete Event OK`);
          return response.ok({ message: 'Event deleted successfully' });
        } catch (error) {
          console.error('Error deleting event:', error);
          return response.internalServerError({ message: 'An error occurred while deleting the event' });
        }
      }
      

      async createOrUpdateEvent({ request, response }: HttpContext) {
        console.log(`createOrUpdateEvent`)
        try {
          const { data } = request.only(['data'])
          if (!data) {
            return response.status(400).json({ error: 'Data is required' })
          }
      
          const { id_event, start_date, end_date, title, type, color, location, description } = data
      
          const emailUser = (request as any).user?.email
          if (!emailUser) {
            return response.status(401).json({ error: 'Unauthorized' })
          }
      
          const user = await findUserByEmail(emailUser)
          if (!user) {
            return response.notFound({ message: 'User not found' })
          }
      
          const formattedStartDate = new Date(start_date).toISOString().slice(0, 19).replace('T', ' ');
          const formattedEndDate = new Date(end_date).toISOString().slice(0, 19).replace('T', ' ');
      
          let event;
          if (id_event) {
            // Vérifier si l'événement existe
            const existingEvent = await db.from('events')
              .where('id_event', id_event)
              .where('id_user', user.id_user)
              .first()
      
            if (existingEvent) {
              // Mettre à jour l'événement existant
              console.log(`createOrUpdateEvent => Update`)
              await db.from('events')
                .where('id_event', id_event)
                .update({ start_date: formattedStartDate, end_date: formattedEndDate, title, type, color, location, description  });
              
              // Récupérer l'événement mis à jour
              event = await db.from('events').where('id_event', id_event).first();
            } else {
              return response.notFound({ message: 'Event not found for update' });
            }
          } else {
            // Créer un nouvel événement sans ID spécifié
            console.log(`createOrUpdateEvent => Create new`)
            event = await db.table('events')
              .insert({
                id_user: user.id_user,
                start_date: formattedStartDate,
                end_date: formattedEndDate,
                title,
                type,
                color,
                location,
                description 
              })
              .returning('*');
            event = event[0];
          }
      
          console.log(`createOrUpdateEvent => OK`)
          return response.ok({
            message: id_event ? 'Event updated successfully' : 'Event created successfully',
            event
          });
        } catch (error) {
          console.error('Error creating/updating event:', error);
          return response.internalServerError({ message: 'An error occurred while processing the event' });
        }
      }         
}
