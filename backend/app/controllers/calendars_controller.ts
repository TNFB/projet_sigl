import { findUserByEmail } from '#utils/api_utils.js'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class CalendarsController {
    public async getEvents({ request, response }: HttpContext) {
        try {

            const { data } = request.only(['data'])
            if (!data) {
                return response.status(400).json({ error: 'Data is required' })
            }
            const { event_id } = data
    
            const emailUser = request.user?.email
            if (!emailUser) {
                return response.status(401).json({ error: 'Unauthorized' })
            }
            const userId = await findUserByEmail(emailUser)
            if(!userId){
                return response.status(401).json({ error: 'Error User Not found' })
            }
            let query = db.from('calendars').where('id_user', userId.id_user )
        
            if (event_id) {
                query = query.where('id_calendar', event_id)
            }
        
            const events = await query.select('*')
        
            if (event_id && events.length === 0) {
                return response.notFound({ message: 'Event not found' })
            }
        
            return response.ok({
                events: event_id ? events[0] : events,
                message: event_id ? 'Event retrieved successfully' : 'Events retrieved successfully',
            })
        } catch (error) {
          console.error('Error fetching events:', error)
          return response.internalServerError({ message: 'An error occurred while fetching events' })
        }
    }

    public async createEvent({ request, response }: HttpContext) {
        try {
            const { data } = request.only(['data'])
            if (!data) {
                return response.status(400).json({ error: 'Data is required' })
            }
            const { id_user, start_date, end_date, title, type, color } = data

            const [newEventId] = await db.table('calendars').insert({
                id_user,
                start_date,
                end_date,
                title,
                type,
                color
            }).returning('id_calendar')
            
            const newEvent = await db.from('calendars').where('id_calendar', newEventId).first()
        
            return response.created({ message: 'Event created successfully', event: newEvent })
        } catch (error) {
            console.error('Error creating event:', error)
            return response.internalServerError({ message: 'An error occurred while creating the event' })
        }
    }

    public async updateEvent({ request, response }: HttpContext) {
    try {
        const { data } = request.only(['data'])
        if (!data) {
            return response.status(400).json({ error: 'Data is required' })
        }
        const { id_calendar, start_date, end_date, title, type, color } = data
    
        const updatedRows = await db.from('calendars')
            .where('id_calendar', id_calendar)
            .update({ start_date, end_date, title, type, color })
    
        if (updatedRows.length === 0) {
            return response.notFound({ message: 'Event not found' })
        }
        
        const updatedEvent = await db.from('calendars').where('id_calendar', id_calendar).first()
        
        return response.ok({ message: 'Event updated successfully', event: updatedEvent })
        } catch (error) {
            console.error('Error updating event:', error)
            return response.internalServerError({ message: 'An error occurred while updating the event' })
        }
    }

    public async deleteEvent({ request, response }: HttpContext) {
    try {
        const { data } = request.only(['data'])
        if (!data) {
        return response.status(400).json({ error: 'Data is required' })
        }
        const { id_calendar } = data
        
        const deletedRows = await db.from('calendars').where('id_calendar', id_calendar).delete()
        
        if (deletedRows.length === 0) {
        return response.notFound({ message: 'Event not found' })
        }
        
        return response.ok({ message: 'Event deleted successfully' })
        } catch (error) {
            console.error('Error deleting event:', error)
            return response.internalServerError({ message: 'An error occurred while deleting the event' })
        }
    }
}