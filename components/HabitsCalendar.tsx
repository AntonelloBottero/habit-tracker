import { useState, useRef, useTransition } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventClickArg, type DatesSetArg } from '@fullcalendar/core/index.js'
import { DbResourceSchema, EventsSchema } from '@/db/DbClass'
import Link from "next/link"
import SidebarView from '@/components/SidebarView'
import ScheduleList from '@/components/ScheduleList'
import EventsForm from '@/components/EventsForm'
import { CalendarToday, RightPanelClose, RightPanelOpen, Settings } from "@project-lary/react-material-symbols-700-rounded"
import "@/css/habits-calendar.css"
import { ModalRef } from '@/app/types'
import { DateTime } from 'luxon'
import Modal from './Modal'
import EventDetailsModal from './EventDetailsModal'
import CalendarToolbar from './CalendarToolbar'
import useCalendar from '@/src/shared/adapters/useCalendar'

export default function HabitsCalendar() {
  const { indexEventables, events, habits } = useCalendar()

  // --- Manage events ---
  const formEventsModal = useRef<ModalRef>(null)
  const [, startResourcesTransition] = useTransition()

  // --- Calendar ---
  const calendarRef = useRef<FullCalendar>(null)

  const [dateArgs, setDateArgs] = useState<DatesSetArg | null>(null) // since fullcalendar has no api to refresh current date, we have to trigger it manually using the last calendar args

  async function fetchResources(calendarArgs?: DatesSetArg) {
    const args = calendarArgs || dateArgs
    if(!args) { return undefined }

    try {
      startResourcesTransition(async () => {
        await indexEventables(args.startStr, args.endStr)
      })
    } catch(error) {
      console.error(error)
    }
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
        {/* Sidebar */}
        <SidebarView
          value={sidebar}
          width={300}
          align="right"
          content={(
            <>
              {/* Sidebar content (slot cards) */}
              <div className="flex items-center my-2">
                <div className="text-xl font-monda font-bold grow-1">
                  Your Schedule
                </div>
                <Link href="/setup" className="ht-btn ht-interaction py-2 px-2 rounded-lg text-white bg-neutral-800">
                  <Settings className="text-xl" />
                </Link>
              </div>
              <ScheduleList habits={formattedHabits} />
            </>
          )}
          onChange={e => setSidebar(e.target.value)}
        >
          <div className="flex-grow p-6 lg:px-10">
            <div className="mx-auto habits-calendar">
              {/* Toolbar */}
              <div className="flex sm:flex-row-reverse justify-between flex-wrap align-center gap-2 mb-6">
                <div className="flex align-center gap-2 sm:w-fit w-full">
                  <button type="button" className="ht-btn py-1.5 px-4 rounded-lg shadow-ht ht-interaction bg-green-200 grow" onClick={() => addEvent()}>
                    <CalendarToday />
                    Add event
                  </button>
                  <button type="button" className="ht-btn ht-interaction py-2 px-2 rounded-lg text-white bg-neutral-800" onClick={() => setSidebar(!sidebar)}>
                    {sidebar ? <RightPanelClose className="text-xl" /> : <RightPanelOpen className="text-xl" />}
                  </button>
                </div>
                <CalendarToolbar ref={calendarRef} />
              </div>

              {/* Calendar */}
              <FullCalendar
                ref={calendarRef}
                plugins={[ dayGridPlugin, interactionPlugin ]}
                initialView="dayGridMonth"
                editable={true}
                headerToolbar={false}
                events={formattedEvents}
                datesSet={fetchResources}
                eventClick={handleEventClick}
                height="calc(100vh - 128px)"
                dayMaxEvents={true}
                displayEventTime={false}
                moreLinkContent={(arg) => {
                  return arg.num
                }}
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