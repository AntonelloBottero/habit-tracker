import { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import Modal from "@/components/Modal"
import { ModalRef } from "@/app/types"
import { DbResourceSchema, EventsSchema, habitsModel, HabitsSchema } from '@/db/DbClass'
import useDbCrud from "@/db/useDbCrud"
import { DateTime } from 'luxon'
import HabitsCard from './HabitsCard'

interface Props {
	event: DbResourceSchema<EventsSchema> | undefined
}

const EventDetailsModal = forwardRef<ModalRef, Props>(({ event }: Props, ref) => {
  // --- Habit ---
  const habitsCrud = useDbCrud({ table: 'events', model: habitsModel })
  const [habit, setHabit] = useState<DbResourceSchema<HabitsSchema> | undefined>(undefined)
  async function fetchHabit() {
    if(!event) { return undefined }
    try {
      await habitsCrud.show(event.habit_id as number).then(setHabit)
    } catch(error) {
      console.error(error)
      setHabit(undefined)
    }
  }

  // --- forwardRef ---
  const modalRef = useRef<ModalRef>(null)
  function show() {
    modalRef.current?.show()
    fetchHabit() // fetch habit only when user needs it
  }
  useImperativeHandle(ref, () => ({
    show,
    hide: () => { modalRef.current?.hide() }
  }))

  return event ? (
    <Modal ref={modalRef} title="Your event" size="max-w-md" role="event-details-modal">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <div className="text-sm font-medium">
						Date & time
          </div>
          <div className="text-base font-bold">
            {DateTime.fromISO(event.datetime).toFormat('dd/MM/yyyy HH:ii')}
          </div>
        </div>
				{habit && (
					<>
						<div className="text-sm font-medium">
							Habit
						</div>
						<HabitsCard habit={habit} />
					</>
				)}
      </div>
    </Modal>
  ) : null
})

export default EventDetailsModal