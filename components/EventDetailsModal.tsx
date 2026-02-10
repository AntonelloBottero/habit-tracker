import { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import Modal from "@/components/Modal"
import { ModalRef } from "@/app/types"
import { DbResourceSchema, EventsSchema, habitsModel, HabitsSchema } from '@/db/DbClass'
import useDbCrud from "@/db/useDbCrud"
import { DateTime } from 'luxon'
import HabitsCard from '@/components/HabitsCard'
import CheckboxBtn from "@/components/CheckboxBtn"
import ConfirmModal from '@/components/ConfirmModal'
import { ConfirmModalRef } from '@/app/types'
import useHabits from "@/hooks/useHabits"

interface Props {
	event: DbResourceSchema<EventsSchema> | undefined,
  onDelete?: () => never | void
}

const EventDetailsModal = forwardRef<ModalRef, Props>(({ event, onDelete }: Props, ref) => {
  const { deleteEvent: _deleteEvent } = useHabits()

  // --- Habit ---
  const habitsCrud = useDbCrud({ table: 'habits', model: habitsModel })
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

  // --- Delete ---
  const confirmDeleteModalRef = useRef<ConfirmModalRef>(null)
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false)
  async function deleteEvent() {
    if(loadingDelete || !event) { return undefined }
    const confirmed = await confirmDeleteModalRef.current?.confirm()
    if(!confirmed) { return undefined }

    setLoadingDelete(true)
    try{
      await _deleteEvent(event.id)
      if(onDelete) {
        onDelete()
      }
    } catch(error) {
      console.error(error)
      // TODO: notify error to user
    }
    setLoadingDelete(false)
  }

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
            <div>
              <div className="text-sm font-medium mb-1">
                Habit
              </div>
              <HabitsCard habit={habit} />
            </div>
            {habit.enough_amount && (
              <div className="flex items-center gap-2">
                <CheckboxBtn
                  id="completed"
                  name="completed"
                  defaultChecked={!!event.completed}
                />
                <div className="text-sm">
                  {habit.enough_amount}
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex justify-end items-center">
          <button type="button" className="ht-btn ht-interaction rounded-lg bg-red-50 text-red-500 py-2 px-5" onClick={deleteEvent}>
            Delete
          </button>
          <ConfirmModal ref={confirmDeleteModalRef} />
        </div>
      </div>
    </Modal>
  ) : null
})

export default EventDetailsModal