'use client'
import { Button } from '@/components/ui/button'
import { dummyEvents } from '@/lib/calendar-data'
import { MyEvent } from '@/types/calendar'
import { format, getDay, parse, startOfWeek } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  SlotInfo,
  ToolbarProps,
  View,
  NavigateAction,
} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar-styles.css'
import { EventDialog } from './event-dialog'
import { EventForm } from './event-form'
import { postRequest } from '@/api/api'

const locales = {
  fr: fr,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function Calendar() {
  const [events, setEvents] = useState<MyEvent[]>(dummyEvents)
  const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
    undefined,
  )
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [currentView, setCurrentView] = useState<View>('month')

  const fetchEvents = async () => {
    try {
      const response = await postRequest('events/getEvents')
      console.log('Fetched events:', response.events)
      if (response.events) {
        const formattedEvents: MyEvent[] = response.events.map(
          (event: any) => ({
            id: event.id_event.toString(),
            title: event.title,
            start: new Date(event.start_date),
            end: new Date(event.end_date),
            type: event.type,
            color: event.color,
            location: event.location,
            description: event.description,
          }),
        )
        setEvents(formattedEvents)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleNavigate = (date: Date, view: View, action: NavigateAction) => {
    setCurrentDate(date)
  }

  const handleViewChange = (view: View) => {
    setCurrentView(view)
  }

  const handleSelectEvent = (event: MyEvent) => {
    console.log(`event.id: ${event.id}`)
    console.log(`event.location: ${event.location}`)
    console.log(`event.description: ${event.description}`)
    setSelectedEvent(event)
    setShowEventDialog(true)
  }

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo.start)
    setSelectedEndDate(slotInfo.end)
    setSelectedEvent(null)
    setShowEventForm(true)
  }

  const handleDeleteEvent = async () => {
    if (selectedEvent && selectedEvent.id) {
      try {
        await postRequest(
          'events/deleteEvent',
          JSON.stringify({ data: { id_event: parseInt(selectedEvent.id) } }),
        )
        fetchEvents()
        setShowEventDialog(false)
      } catch (error) {
        console.error('Error deleting event:', error)
        alert("Erreur lors de la suppression de l'événement")
      }
    } else {
      console.error('No event selected or event ID is missing')
      alert("Impossible de supprimer l'événement : ID manquant")
    }
  }

  const handleEditEvent = () => {
    setShowEventDialog(false)
    setShowEventForm(true)
  }

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setShowEventForm(true)
  }

  const handleSaveEvent = async (event: MyEvent) => {
    try {
      const eventData = {
        id_event: event.id || undefined,
        start_date: event.start.toISOString(),
        end_date: event.end.toISOString(),
        title: event.title,
        type: event.type || 'default',
        color: event.color || '#3788d8',
        location: event.location || '',
        description: event.description || '',
      }

      await postRequest(
        'events/createOrUpdateEvent',
        JSON.stringify({ data: eventData }),
      )

      fetchEvents()
      setShowEventForm(false)
    } catch (error) {
      console.error('Error saving event:', error)
      alert("Erreur lors de l'enregistrement de l'événement")
    }
  }

  const eventStyleGetter = (event: MyEvent) => {
    const backgroundColor = event.color
    const style = {
      backgroundColor,
      borderRadius: '0.5rem',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    }
    return {
      style,
    }
  }

  const CustomToolbar: React.FC<ToolbarProps<MyEvent>> = (props) => {
    const { label, onView, onNavigate } = props

    return (
      <div className='flex items-center justify-between py-4 border-b'>
        <div className='flex items-center space-x-4'>
          <Button variant='outline' onClick={() => onNavigate('TODAY')}>
            Aujourd&apos;hui
          </Button>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' onClick={() => onNavigate('PREV')}>
              Précédent
            </Button>
            <Button variant='outline' onClick={() => onNavigate('NEXT')}>
              Suivant
            </Button>
          </div>
          <h2 className='text-xl font-semibold'>{label}</h2>
        </div>
        <div className='flex items-center space-x-4'>
          <Button
            onClick={handleAddEvent}
            className='flex items-center space-x-2'
          >
            <Plus className='w-4 h-4' />
            <span>Ajouter</span>
          </Button>
          <div className='flex space-x-2'>
            {[
              { viewType: 'month', label: 'Mois' },
              { viewType: 'week', label: 'Semaine' },
              { viewType: 'day', label: 'Jour' },
            ].map(({ viewType, label }) => (
              <Button
                key={viewType}
                variant='outline'
                onClick={() => onView(viewType as View)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='h-full w-full px-4'>
      <div className='h-[calc(85vh-3rem)] rounded-lg shadow-sm'>
        <BigCalendar
          localizer={localizer}
          events={events}
          defaultView='month'
          views={['month', 'week', 'day']}
          date={currentDate}
          view={currentView}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
          selectable
          components={{
            toolbar: CustomToolbar,
          }}
          culture='fr'
        />
      </div>

      <EventDialog
        event={selectedEvent}
        open={showEventDialog}
        onClose={() => setShowEventDialog(false)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      <EventForm
        event={selectedEvent}
        open={showEventForm}
        onClose={() => {
          setShowEventForm(false)
          setSelectedEndDate(undefined)
        }}
        onSave={handleSaveEvent}
        selectedDate={selectedSlot ?? undefined}
        selectedEndDate={selectedEndDate}
      />
    </div>
  )
}
