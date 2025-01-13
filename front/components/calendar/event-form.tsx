'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MyEvent } from '@/types/calendar'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

interface EventFormProps {
  event?: MyEvent | null
  open: boolean
  onClose: () => void
  onSave: (event: MyEvent) => void
  selectedDate?: Date
  selectedEndDate?: Date
}

interface FormData {
  title: string
  description: string
  location: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  type: string
  color: string
}

const defaultFormData = {
  title: '',
  description: '',
  location: '',
  startDate: '',
  startTime: '00:00',
  endDate: '',
  endTime: '23:59',
}

export function EventForm({
  event,
  open,
  onClose,
  onSave,
  selectedDate,
  selectedEndDate,
}: EventFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '00:00',
    endDate: '',
    endTime: '23:59',
    type: '',
    color: '#000000' // Couleur par défaut
  })

  useEffect(() => {
    if (event) {
      console.log(`Event Form location: ${event.location}`)
      setFormData({
        title: event.title,
        description: event.description || '',
        location: event.location || '',
        startDate: format(event.start, 'yyyy-MM-dd'),
        startTime: format(event.start, 'HH:mm'),
        endDate: format(event.end, 'yyyy-MM-dd'),
        endTime: format(event.end, 'HH:mm'),
        type: event.type || '',
        color: event.color || '#000000'
      });
    }
  }, [event]);  


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const start = new Date(`${formData.startDate}T${formData.startTime}`);
    const end = new Date(`${formData.endDate}T${formData.endTime}`);
  
    const newEvent: MyEvent = {
      id: event?.id || undefined,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      start,
      end,
      type: formData.type,
      color: formData.color
    };
  
    onSave(newEvent); // Passez newEvent à onSave
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className='sm:max-w-[500px]'
        aria-describedby='event-description'
      >
        <DialogHeader>
          <DialogTitle className='text-xl'>
            {event ? "Modifier l'événement" : 'Créer un événement'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-6 mt-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Nom de l&apos;événement</Label>
            <Input
              id='title'
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className='w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-md p-2 placeholder-gray-500'
              placeholder="Entrer le nom de l'événement"
              required
            />
          </div>
  
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label>Date début</Label>
              <div className='space-y-2'>
                <Input
                  type='date'
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                  className='w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-md p-2 placeholder-gray-500'
                />
                <Input
                  type='time'
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                  className='w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-md p-2 placeholder-gray-500'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Date fin</Label>
              <div className='space-y-2'>
                <Input
                  type='date'
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                  className='w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-md p-2 placeholder-gray-500'
                />
                <Input
                  type='time'
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  required
                  className='w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-md p-2 placeholder-gray-500'
                />
              </div>
            </div>
          </div>
  
          <div className='space-y-2'>
            <Label htmlFor='type'>Type d'événement</Label>
            <Input
              id='type'
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className='w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-md p-2 placeholder-gray-500'
              placeholder="Entrer le type d'événement"
              required
            />
          </div>
  
          <div className='space-y-2'>
            <Label htmlFor='color'>Couleur de l'événement</Label>
            <Input
              id='color'
              type='color'
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className='w-full h-10 bg-gray-100 text-gray-900 border border-gray-300 rounded-md p-2'
              required
            />
          </div>
  
          <div className='space-y-2'>
            <Label htmlFor='location'>Emplacement (Optionnel)</Label>
            <Input
              id='location'
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder='Enter location'
              className='w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-md p-2 placeholder-gray-500'
            />
          </div>
  
          <div className='space-y-2' id='event-description'>
            <Label htmlFor='description'>Description (Optionnel)</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              placeholder='Ajouter description'
              className='w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-md p-2 placeholder-gray-500'
            />
          </div>
  
          <div className='flex justify-end space-x-2'>
            <Button type='button' variant='outline' onClick={onClose}>
              Annuler
            </Button>
            <Button type='submit'>{event ? 'Mettre à jour' : 'Créer'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )  
}
