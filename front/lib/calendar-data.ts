import { MyEvent } from '@/types/calendar'

export const dummyEvents: MyEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(2025, 0, 20, 10, 0),
    end: new Date(2025, 0, 20, 11, 30),
    description: 'Weekly team sync',
    location: 'Conference Room A',
    type: 'meeting',
    color: 'blue',
  },
]
