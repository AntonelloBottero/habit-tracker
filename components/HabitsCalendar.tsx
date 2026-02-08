'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { EventClickArg, type DatesSetArg } from '@fullcalendar/core/index.js'
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
  const [events, setEvents] = useState<DbResourceSchema<EventsSchema>[]>([])

  const formattedEvents = useMemo(() => {
    return events
      .map(event => {
        const habit = habits.find(habit => habit.id === event.habit_id)
        if(!habit) { return null }
        return {
          ...event,
          habit,
          // fullcalendar compliant params
          title: habit.name,
          start: event.datetime,
          end: DateTime.fromISO(event.datetime).plus({ minutes: 1 }).toISO(),
          color: habit.color
        }
      })
      .filter(Boolean)
  }, [events, habits])

  // --- Calendar ---
  const calendarRef = useRef<FullCalendar>(null)

  const eventsCrud = useDbCrud({ table: 'events', model: eventsModel })

  const [dateArgs, setDateArgs] = useState<DatesSetArg | null>(null) // since fullcalendar has no api to refresh current date, we have to trigger it manually using the last calendar args

  async function fetchResources(calendarArgs?: DatesSetArg) {
    const args = calendarArgs || dateArgs
    if(!args) { return undefined }

    try {
      await fetchActiveSlots(args.startStr, args.endStr).then(setSlots)
      await eventsCrud.index(item => item.datetime >= args.startStr && item.datetime <= args.endStr).then(setEvents)
    } catch(error) {
      console.error(error)
      setSlots([])
      setEvents([])
    }
    setDateArgs(args)
  }

  function handleDateClick(args: DateClickArg) {
    setFormEventsValues({
      datetime: args.dateStr
    })
    formEventsModal.current?.show()
  }

  function addEvent() {
    setFormEventsValues({
      datetime: DateTime.now().toISO()
    })
    formEventsModal.current?.show()
  }

  async function handleEventClick(eventInfo: EventClickArg) {
    try {
      const values = await eventsCrud.show(Number(eventInfo.event.id))
      setFormEventsValues(values)
      formEventsModal.current?.show()
    } catch(error) {

    }
  }

  function handleEventsFormSave() {
    formEventsModal.current?.show()
    fetchResources()
  }

  return (
    <>
      <div className="w-full min-h-full habits-calendar flex items-stretch">
        <div className="flex-grow bg-white p-6 lg:px-10">
          <FullCalendar
            ref={calendarRef}
            plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            editable={true}
            customButtons={{
              addEvent: {
                text: 'Add event',
                click: function() {
                  addEvent()
                },
              },
            }}
            headerToolbar={{
              left: 'title',
              right: 'today prev,next addEvent',
            }}
            events={formattedEvents}
            datesSet={fetchResources}
            eventClick={handleEventClick}
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