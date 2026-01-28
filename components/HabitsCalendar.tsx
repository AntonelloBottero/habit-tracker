'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { type DatesSetArg } from '@fullcalendar/core/index.js'
import { DbResourceSchema, eventsModel, EventsSchema, habitsModel, HabitsSchema, SlotsSchema } from '@/db/DbClass'
import Sidebar from '@/components/Sidebar'
import useDbCrud from '@/db/useDbCrud'
import useHabits from '@/hooks/useHabits'
import CompressedSlotsCard from '@/components/CompressedSlotsCard'
import SlotsCard from '@/components/SlotsCard'
import EventsForm from '@/components/EventsForm'
import "@/css/habits-calendar.css"
import { HabitWithSlots, ModalRef } from '@/app/types'
import { DateTime } from 'luxon'
import Modal from './Modal'

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
      .filter(habit => habit.slots.length)
  }, [slots, habits])

  // --- Manage events ---
  const formEventsModal = useRef<ModalRef>(null)
  const [formEventsValues, setFormEventsValues] = useState<Partial<DbResourceSchema<EventsSchema>> | undefined>(undefined)

  // --- Calendar ---
  const calendarRef = useRef<FullCalendar>(null)

  const eventsCrud = useDbCrud({ table: 'events', model: eventsModel })
  const [events, setEvents] = useState<DbResourceSchema<EventsSchema>[]>([])

  async function handleDatesSet(args: DatesSetArg) {
    console.log('args', args)
    try {
      await fetchActiveSlots(args.startStr).then(setSlots)
      await eventsCrud.index(item => item.datetime >= args.startStr && item.datetime <= args.endStr).then(setEvents)
    } catch(error) {
      console.error(error)
      setSlots([])
    }
  }

  function handleDateClick(args: DateClickArg) {
    setFormEventsValues({
      datetime: DateTime.fromJSDate(args.date).toISO() || ''
    })
    formEventsModal.current?.show()
  }

  function handleEventsFormSave() {
    calendarRef.current?.getApi()?.refetchEvents()
  }

  return (
    <>
      <div className="w-full min-h-full habits-calendar flex">
        <div className="flex-grow bg-white p-6 lg:px-10">
          <FullCalendar
            ref={calendarRef}
            plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            editable={true}
            datesSet={handleDatesSet}
            dateClick={handleDateClick}
          />
        </div>
        <Sidebar initialValue={true} width="320px" align="right" title="Your Schedule">
          {formattedHabits.map(habit => (
            <div key={habit.id}>
              {habit.slots.length === 1 ? <SlotsCard habit={habit} slot={habit.slots[0]} /> : <CompressedSlotsCard habit={habit} key={habit.id} />}
            </div>
          ))}
        </Sidebar>
      </div>

      <Modal ref={formEventsModal} title="Add event" size="max-w-md">
        <EventsForm values={formEventsValues} onSave={handleEventsFormSave} />
      </Modal>
    </>
  )
}