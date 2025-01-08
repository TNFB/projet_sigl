import { findUserByEmail } from '#utils/api_utils.js'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class EventsController {
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
            const user = await findUserByEmail(emailUser)
            if (!user) {
                return response.status(401).json({ error: 'Error User Not found' })
            }
            let query = db.from('events').where('id_user', user.id_user)

            if (event_id) {
                query = query.where('id_event', event_id) 
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
            const { start_date, end_date, title, type, color } = data

            const emailUser = request.user?.email
            if (!emailUser) {
                return response.status(401).json({ error: 'Unauthorized' })
            }
            const user = await findUserByEmail(emailUser)
            if (!user) {
                return response.status(401).json({ error: 'Error User Not found' })
            }

            const [newEventId] = await db.table('events').insert({
                id_user: user.id_user,
                start_date,
                end_date,
                title,
                type,
                color
            }).returning('id_event') 
            
            const newEvent = await db.from('events').where('id_event', newEventId).first() 

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
            const { id_event, start_date, end_date, title, type, color } = data 

            const updatedRows = await db.from('events') 
                .where('id_event', id_event) 
                .update({ start_date, end_date, title, type, color })

            if (updatedRows.length === 0) { 
                return response.notFound({ message: 'Event not found' })
            }

            const updatedEvent = await db.from('events').where('id_event', id_event).first() 

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
            const { id_event } = data 

            const deletedRows = await db.from('events').where('id_event', id_event).delete() 

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
