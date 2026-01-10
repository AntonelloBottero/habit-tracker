// components/BigCalendar.js
'use client'

import { useState, useMemo } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'

const localizer = momentLocalizer(moment)

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
    <div className="w-full h-[600px]">
      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        className="shadow-ht"
      />
    </div>
  )
}