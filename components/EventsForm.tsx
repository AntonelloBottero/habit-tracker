import { useRef, forwardRef, useImperativeHandle } from "react"
import { CalendarCheck } from '@project-lary/react-material-symbols-700-rounded'
import CardsInput from "@/components/CardsInput"
import HabitsCardHeader from "@/components/HabitsCardHeader"
import SlotsCompletionChip from "@/components/SlotsCompletionChip"
import { CalendarToday } from "@project-lary/react-material-symbols-700-rounded"
import InputWrapper from "@/components/InputWrapper"
import CheckboxBtn from "@/components/CheckboxBtn"
import ConfirmModal from '@/components/ConfirmModal'
import { ConfirmModalRef } from '@/app/types'
import { EventRawProps } from "@/src/events/mappers/EventMapper"
import { EventsFormRef } from "@/src/shared/infrastructure/contracts"
import useEventsCrud from "@/src/events/adapters/useEventsCrud"

interface Props {
  onSave?: (values: EventRawProps) => never | void
  onDelete?: () => never | void
}

const EventsForm = forwardRef<EventsFormRef, Props>(({ onSave, onDelete }: Props, ref) => {
  // --- useHabitsCrud ---
  const {
    form,
    store,
    update,
    deleteEvent: adapterDeleteEvent,
    // loadingSave,
    eventableHabits,
    selectedHabit,
    isNew,
  } = useEventsCrud({ onSave, onDelete })

  // --- Delete ---
  const confirmDeleteModalRef = useRef<ConfirmModalRef>(null)
  async function deleteEvent() {
    const confirmed = await confirmDeleteModalRef.current?.confirm()
    if(!confirmed) { return undefined }

    try{
      await adapterDeleteEvent()
      if(onDelete) {
        onDelete()
      }
    } catch(error) {
      console.error(error)
      // TODO: notify error to user
    }
  }

  useImperativeHandle(ref, () => ({
    store,
    update
  }))

  return (
    <form onSubmit={form.handleFormSubmit} className="grid grid-cols-1 gap-x-3">
      <div>
        <InputWrapper errorMessages={form.errorMessages.datetime} label="Date & time" input={(
          <input
            id="datetime"
            type="text"
            name="datetime"
            className="grow w-full ht-form-input"
            placeholder="Date & time of your check"
            value={form.model.date}
            readOnly
          />
        )}/>
      </div>
      <div>
        <InputWrapper
          errorMessages={form.errorMessages.habit_id}
          label="Select the habit"
          input={(
            <CardsInput
              value={form.model.habit_id}
              onChange={e => form.changeField('habit_id', e.target.value)}
              items={eventableHabits}
              content={(item) => (
                <>
                  <HabitsCardHeader habit={item} />
                  <div className="flex items-center flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-sm mr-1">
                      <CalendarToday />
                      <span>
                        {item.granularity}
                        {item.granularity_times > 1 && ` (${item.granularity_times} times)`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <SlotsCompletionChip completion={item.slot.completion} count={item.slot.count} active_to={item.slot.active_to} />
                    </div>
                  </div>
                </>
              )}
            />
          )}
        />
      </div>

      {selectedHabit?.enough_amount && (
        <div>
          <InputWrapper label="Did enough?" input={(
            <div className="w-full rounded-lg flex items-center outline-1 -outline-offset-1 outline-white gap-2">
              <CheckboxBtn
                id="completed"
                name="completed"
                defaultChecked={!!form.model.completed}
                onChange={e => form.changeField('completed', e.target.checked ? 1 : 0)}
              />
              <div className="text-sm">
                {selectedHabit.enough_amount}
              </div>
            </div>
          )} />
        </div>
      )}

      <div className="flex justify-end items-center gap-4">
        {isNew ? (
          <>
            {selectedHabit?.enough_amount && !form.model.completed && (
              <div className="text-sm text-gray-600">
                You have to do more...
              </div>
            )}
            <button type="submit" className="ht-btn ht-btn--size-large ht-interaction bg-green-200 shadow-ht" disabled={!!selectedHabit?.enough_amount && !form.model.completed}>
              <CalendarCheck />
              Add event
            </button>
          </>
        ) : (
          <>
            <button type="button" className="ht-btn ht-interaction rounded-lg bg-red-50 text-red-500 py-2 px-5 mr-2" onClick={deleteEvent}>
              Delete
            </button>
            <ConfirmModal ref={confirmDeleteModalRef} />
          </>
        )}
      </div>
    </form>
  )
})

export default EventsForm