import { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import Modal from "@/components/Modal"
import { DateTime } from 'luxon'
import HabitsCard from '@/components/HabitsCard'
import CheckboxBtn from "@/components/CheckboxBtn"
import ConfirmModal from '@/components/ConfirmModal'
import { EventRawProps } from '@/src/events/mappers/EventMapper'
import { HabitRawProps } from '@/src/habits/mappers/HabitMapper'
import useEventsCrud from '@/src/events/adapters/useEventsCrud'
import { ConfirmModalRef, EventDetailsModalRef, ModalRef } from '@/src/shared/infrastructure/contracts'

interface Props {
  onDelete?: () => never | void
}

const EventDetailsModal = forwardRef<EventDetailsModalRef, Props>(({ onDelete }: Props, ref) => {
  const { deleteEvent: _deleteEvent } = useEventsCrud({ onDelete })

  // --- Habit ---
  const [event, setEvent] = useState<EventRawProps | undefined>(undefined)
  const [habit, setHabit] = useState<HabitRawProps | undefined>(undefined)

  // --- forwardRef ---
  const modalRef = useRef<ModalRef>(null)
  function show(_event: EventRawProps, _habit: HabitRawProps) {
    if(!_event || !_habit) { return undefined }
    setEvent(_event)
    setHabit(_habit)
    modalRef.current?.show()
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
      setEvent(undefined)
      setHabit(undefined)
      modalRef.current?.hide()
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