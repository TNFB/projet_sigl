'use client'
import { Button } from '@/components/ui/button'
import { dummyEvents } from '@/lib/calendar-data'
import { MyEvent } from '@/types/calendar'
import { format, getDay, parse, startOfWeek } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import { useState } from 'react'
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

  const handleNavigate = (date: Date, view: View, action: NavigateAction) => {
    setCurrentDate(date)
  }

  const handleViewChange = (view: View) => {
    setCurrentView(view)
  }

  const handleSelectEvent = (event: MyEvent) => {
    setSelectedEvent(event)
    setShowEventDialog(true)
  }

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo.start)
    setSelectedEndDate(slotInfo.end)
    setShowEventForm(true)
  }

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter((event) => event.id !== selectedEvent.id))
      setShowEventDialog(false)
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

  const handleSaveEvent = (event: MyEvent) => {
    setEvents((prevEvents) => {
      const eventIndex = prevEvents.findIndex((e) => e.id === event.id)
      if (eventIndex !== -1) {
        console.log('updating event')
        const updatedEvents = [...prevEvents]
        updatedEvents[eventIndex] = event
        return updatedEvents
      } else {
        const newEvent: MyEvent = { ...event, id: String(Date.now()) }
        return [...prevEvents, newEvent]
      }
    })
    setShowEventForm(false)
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
