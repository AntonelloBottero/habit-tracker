'use client'

import { useState, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import Sidebar from './Sidebar'
import "@/css/habits-calendar.css"

const events = [
  {
    id: 0,
    title: 'La mia prima abitudine',
    start: new Date(2025, 9, 21, 10, 0, 0),
    end: new Date(2025, 9, 21, 10, 30, 0),
  },
  // Aggiungi altri eventi
]

export default function HabitsCalendar() {
  const [myEvents, setMyEvents] = useState(events)

  return (
    <div className="w-full h-full habits-calendar flex">
      <div className="flex-grow h-full">
        <FullCalendar
          plugins={[ dayGridPlugin ]}
          initialView="dayGridMonth"
        />
      </div>
      <Sidebar initialValue={true} />
    </div>
  )
}