import db from '@adonisjs/lucid/services/db'
import { sendEmailToUser } from '../utils/email_utils.js'
import cron from 'node-cron'
import { tz } from 'tz'

async function checkEventsAndSendReminders() {
    console.log('Checking events and sending reminders...')
  try {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const formattedDate = tomorrow.toISOString().split('T')[0]
    console.log('Tomorrow:', formattedDate)

    const events = await db
      .from('events')
      .whereRaw('DATE(start_date) = ?', [formattedDate])
      .select('id_event', 'title', 'start_date', 'id_user')

    console.log(`Found ${events.length} events for tomorrow`)
    for (const event of events) {
      const user = await db
        .from('users')
        .where('id_user', event.id_user)
        .first()
        console.log('User:', user)
      if (user) {
        const subject = `Reminder: Upcoming Event "${event.title}"`
        const eventTime = new Date(event.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        const text = `Cher/Chère ${user.name},\n\nCeci est un rappel que l'événement "${event.title}" est prévu pour demain à ${eventTime}.\n\nCordialement,\nVotre équipe`

        await sendEmailToUser(user.email, subject, text)
        console.log(`Reminder email sent to ${user.email} for event "${event.title}"`)
      }
    }
  } catch (error) {
    console.error('Error checking events and sending reminders:', error)
  }
}

// Planifier la tâche pour s'exécuter tous les jours à 23h05 dans le fuseau horaire spécifié
cron.schedule('0 16 * * *', () => {
    console.log('Cron job started')
    checkEventsAndSendReminders()
  }, {
    scheduled: true,
    timezone: "Europe/Paris"
  })