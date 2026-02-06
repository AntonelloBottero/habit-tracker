import { useRef, useState, forwardRef, useImperativeHandle } from "react"
import { DbResourceSchema, eventsModel, EventsSchema, HabitsSchema, SlotsSchema } from "@/db/DbClass"
import Modal from "@/components/Modal"
import HabitsCardHeader from "@/components/HabitsCardHeader"
import SlotsCompletionChip from "@/components/SlotsCompletionChip"
import { CalendarToday, CheckCircle, CalendarClock } from "@project-lary/react-material-symbols-700-rounded"
import { ModalRef } from "@/app/types"
import useDbCrud from "@/db/useDbCrud"
import EventsCard from "./EventsCard"

interface Props {
  slot: DbResourceSchema<SlotsSchema> | null
  habit: DbResourceSchema<HabitsSchema>
  className?: string
}

const SlotDetailsModal = forwardRef<ModalRef, Props>(({ slot, habit }: Props, ref) => {
  const modalRef = useRef<ModalRef>(null)

  // --- Slot events ---
  const eventsCrud = useDbCrud({ table: 'events', model: eventsModel })
  const [events, setEvents] = useState<DbResourceSchema<EventsSchema>[]>([])
  async function fetchEvents() {
    if(!slot) { return undefined }
    try {
      const e = await eventsCrud.index(item => slot.event_ids.includes(item.id))
      setEvents(e)
    } catch(error) {
      console.error(error)
      setEvents([])
    }
  }

  // --- forwardRef ---
  function show() {
    modalRef.current?.show()
    fetchEvents() // fetch events only when user requests them
  }
  useImperativeHandle(ref, () => ({
    show,
    hide: () => { modalRef.current?.hide() }
  }))

  return habit ? (
    <Modal ref={modalRef} title="Progress details" size="max-w-md" role="slot-details-modal">
      <div className="flex flex-col gap-2">
        <HabitsCardHeader habit={habit} />
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1 text-sm mr-1">
            <CalendarToday />
            <span>
              {habit.granularity}
              {habit.granularity_times > 1 && ` (${habit.granularity_times} times)`}
            </span>
          </div>
          {habit.enough_amount && (
            <div className="flex items-center gap-1 text-sm mr-1">
              <CheckCircle />
              <span>
                {habit.enough_amount}
              </span>
            </div>
          )}
        </div>
      </div>
      {slot && (
        <>
        <div className="w-full border-t-1 border-stone-200" />
      <div className="flex items-center gap-2">
        <div className="grow font-bold mr-2">
          Slot details
        </div>
        <SlotsCompletionChip completion={slot.completion} count={slot.count} active_to={slot.active_to} />
      </div>
      {events.length ? (
        <div className="flex flex-col gap-4">
          {events.map(event => <EventsCard key={event.id} habit={habit} event={event} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 mt-6 mb-4 text-center">
          <CalendarClock className="text-6xl text-gray-200" />
          No events found
        </div>
      )}
      </>
    )}
    </Modal>
  ) : null
})

export default SlotDetailsModal