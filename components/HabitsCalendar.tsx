'use client'

import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import Sidebar from './Sidebar'
import useDbCrud from '@/db/useDbCrud'
import { DbResourceSchema, habitsModel, HabitsSchema } from '@/db/DbClass'
import "@/css/habits-calendar.css"

export default function HabitsCalendar() {
  // --- Habits ---
  const habitsCrud = useDbCrud({table: 'habits', model: habitsModel })
  const [habits, setHabits] = useState<DbResourceSchema<HabitsSchema>[]>([])

  async function fetchHabits() {
    let h: DbResourceSchema<HabitsSchema>[]
    try {
      h = await habitsCrud.index()
    } catch(error) {
      console.error(error)
      h = []
    }
    setHabits(h)
  }

  useEffect(() => {
    fetchHabits()
  }, [])

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