import { useState, useRef, useTransition } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { EventClickArg, EventInput, type DatesSetArg } from '@fullcalendar/core/index.js'
import { DbResourceSchema, eventsModel, EventsSchema, habitsModel, HabitsSchema, SlotsSchema } from '@/db/DbClass'
import Link from "next/link"
import SidebarView from '@/components/SidebarView'
import useDbCrud from '@/db/useDbCrud'
import useHabits from '@/hooks/useHabits'
import CompressedSlotsCard from '@/components/CompressedSlotsCard'
import SlotsCard from '@/components/SlotsCard'
import EventsForm from '@/components/EventsForm'
import { CalendarToday, RightPanelClose, RightPanelOpen, Settings } from "@project-lary/react-material-symbols-700-rounded"
import "@/css/habits-calendar.css"
import { HabitWithSlots, ModalRef } from '@/app/types'
import { DateTime } from 'luxon'
import Modal from './Modal'
import EventDetailsModal from './EventDetailsModal'
import CalendarToolbar from './CalendarToolbar'

export default function HabitsCalendar() {
  // --- Active slots ---
  const { fetchActiveSlots } = useHabits()
  const [slots, setSlots] = useState<DbResourceSchema<SlotsSchema>[]>([])

  // --- Habits ---
  const habitsCrud = useDbCrud('habits', habitsModel)
  const [habits, setHabits] = useState<DbResourceSchema<HabitsSchema>[] | null>(null)

  const formattedHabits: HabitWithSlots[] = habits?.map((habit) => ({ ...habit, slots: slots.filter(slot => slot.habit_id === habit.id) })).filter(habit => habit.slots.length) ?? []

  // --- Manage events ---
  const formEventsModal = useRef<ModalRef>(null)
  const [formEventsValues, setFormEventsValues] = useState<Partial<DbResourceSchema<EventsSchema>> | undefined>(undefined)
  const [events, setEvents] = useState<DbResourceSchema<EventsSchema>[]>([])
  const [isResourcesTransitionPending, startResourcesTransition] = useTransition()

  const formattedEvents = events
    .map(event => {
      const habit = habits?.find(habit => habit.id === event.habit_id)
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
    .filter(Boolean) as unknown as EventInput[]

  // --- Calendar ---
  const calendarRef = useRef<FullCalendar>(null)

  const eventsCrud = useDbCrud('events', eventsModel)

  const [dateArgs, setDateArgs] = useState<DatesSetArg | null>(null) // since fullcalendar has no api to refresh current date, we have to trigger it manually using the last calendar args

  async function fetchResources(calendarArgs?: DatesSetArg) {
    const args = calendarArgs || dateArgs
    if(!args) { return undefined }

    await Promise.all([ // we allow React to batch all resurces state updates by updating those states only after all promises have resolved
      !habits ? habitsCrud.index() : null,
      fetchActiveSlots(args.startStr, args.endStr),
      eventsCrud.index(item => item.datetime >= args.startStr && item.datetime <= args.endStr)
    ]).then(([h, as, e]) => {
      startResourcesTransition(() => {
        if(h) { setHabits(h) }
        setSlots(as.sort((a, b) => a.active_to > b.active_to ? 1 : -1))
        setEvents(e)
      })
    }).catch(error => {
      console.error(error)
      startResourcesTransition(() => {
        setHabits(null)
        setSlots([])
        setEvents([])
      })
    })

    setDateArgs(args)
  }

  function handleDateClick(args: DateClickArg) {
    setFormEventsValues({
      datetime: args.dateStr
    })
    formEventsModal.current?.show()
  }

  // --- Add event ---
  function addEvent() {
    setFormEventsValues({
      datetime: DateTime.now().toISO()
    })
    formEventsModal.current?.show()
  }

  function handleEventsFormSave() {
    formEventsModal.current?.hide()
    fetchResources()
  }

  // --- Manage existing event ---
  const eventDetailsModal = useRef<ModalRef>(null)
  const [selectedEvent, setSelectedEvent] = useState<DbResourceSchema<EventsSchema> | undefined>(undefined)
  async function handleEventClick(eventInfo: EventClickArg) {
    try {
      await eventsCrud.show(Number(eventInfo.event.id)).then(setSelectedEvent)
      setTimeout(() => {
        eventDetailsModal.current?.show()
      })
    } catch(error) {
      console.error(error)
    }
  }

  function handleEventDelete() {
    eventDetailsModal.current?.hide()
    fetchResources()
  }

  //--- Sidebar ---
  const [sidebar, setSidebar] = useState<boolean>(true)

  return (
    <>
      <div className="w-full h-[100vh] ">
        <SidebarView
          value={sidebar}
          width={320}
          align="right"
          content={(
            <>
              <div className="flex items-center my-2">
                <div className="text-xl font-monda font-bold grow-1">
                  Your Schedule
                </div>
                <Link href="/setup" className="ht-btn ht-interaction py-2 px-2 rounded-lg text-white bg-neutral-800">
                  <Settings className="text-xl" />
                </Link>
              </div>
              {formattedHabits.map(habit => (
                <div key={habit.id}>
                  {habit.slots.length === 1 ? <SlotsCard habit={habit} slot={habit.slots[0]} /> : false ? <CompressedSlotsCard habit={habit} key={habit.id} /> : 'CompressedSlotsCard'}
                </div>
              ))}
            </>
          )}
          onChange={e => setSidebar(e.target.value)}
        >
          <div className="flex-grow p-6 lg:px-10">
            <div style={{maxWidth: '115vh'}} className="mx-auto habits-calendar">
              <CalendarToolbar ref={calendarRef} className="mb-6">
                <>
                  <button type="button" className="ht-btn py-1.5 px-4 rounded-lg shadow-ht ht-interaction bg-green-200" onClick={() => addEvent()}>
                    <CalendarToday />
                    Add event
                  </button>
                  <button type="button" className="ht-btn ht-interaction py-2 px-2 rounded-lg text-white bg-neutral-800" onClick={() => setSidebar(!sidebar)}>
                    {sidebar ? <RightPanelClose className="text-xl" /> : <RightPanelOpen className="text-xl" />}
                  </button>
                </>
              </CalendarToolbar>
               {String(isResourcesTransitionPending)}
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
                headerToolbar={false}
                events={formattedEvents}
                datesSet={fetchResources}
                eventClick={handleEventClick}
              />
            </div>
          </div>
        </SidebarView>
      </div>

      <Modal ref={formEventsModal} title="Add event" size="max-w-md">
        <EventsForm values={formEventsValues} onSave={handleEventsFormSave} />
      </Modal>

      <EventDetailsModal
        ref={eventDetailsModal}
        event={selectedEvent}
        onDelete={handleEventDelete}
      />
    </>
  )
}