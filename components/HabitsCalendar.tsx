'use client'

import { useState, useEffect, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { type DatesSetArg } from '@fullcalendar/core/index.js'
import Sidebar from '@/components/Sidebar'
import useDbCrud from '@/db/useDbCrud'
import useHabits from '@/hooks/useHabits'
import { DbResourceSchema, habitsModel, HabitsSchema, SlotsSchema } from '@/db/DbClass'
import "@/css/habits-calendar.css"
import SlotsCard from './SlotsCard'
import { SlotWithHabit } from '@/app/types'

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

  // --- Active slots ---
  const { fetchActiveSlots } = useHabits()
  const [slots, setSlots] = useState<DbResourceSchema<SlotsSchema>[]>([])
  const formattedSlots = useMemo<SlotWithHabit[]>(() => {
    return slots.map((slot) => ({
      ...slot,
      habit: habits.find(habit => habit.id === slot.habit_id)
    })) as SlotWithHabit[]
  }, [slots, habits])

  // --- Calendar ---
  async function handleDatesSet(args: DatesSetArg) {
    try {
      const s = await fetchActiveSlots(args.startStr)
      setSlots(s)
    } catch(error) {
      console.error(error)
      setSlots([])
    }
  }

  return (
    <div className="w-full h-full habits-calendar flex">
      <div className="flex-grow h-full bg-white">
        <FullCalendar
          plugins={[ dayGridPlugin ]}
          initialView="dayGridMonth"
          datesSet={handleDatesSet}
        />
      </div>
      <Sidebar initialValue={true}>
        <div className="flex flex-col gap-4">
          {formattedSlots.map(slot => (
            <SlotsCard slot={slot} key={slot.id} />
          ))}
        </div>
      </Sidebar>
    </div>
  )
}