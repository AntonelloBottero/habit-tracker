'use client'

import { useState, useEffect, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { type DatesSetArg } from '@fullcalendar/core/index.js'
import { DbResourceSchema, habitsModel, HabitsSchema, SlotsSchema } from '@/db/DbClass'
import Sidebar from '@/components/Sidebar'
import useDbCrud from '@/db/useDbCrud'
import useHabits from '@/hooks/useHabits'
import CompressedSlotsCard from '@/components/CompressedSlotsCard'
import "@/css/habits-calendar.css"
import { HabitWithSlots } from '@/app/types'

export default function HabitsCalendar() {
  // --- Active slots ---
  const { fetchActiveSlots } = useHabits()
  const [slots, setSlots] = useState<DbResourceSchema<SlotsSchema>[]>([])

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

  const formattedHabits = useMemo<HabitWithSlots[]>(() => {
    return habits
      .map((habit) => ({
        ...habit,
        slots: slots.filter(slot => slot.habit_id === habit.id)
      }))
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
      <Sidebar initialValue={true} width="320px" title="Your Schedule">
        <div className="flex flex-col gap-4">
          {formattedHabits.map(habit => (
            <CompressedSlotsCard habit={habit} key={habit.id} />
          ))}
        </div>
      </Sidebar>
    </div>
  )
}