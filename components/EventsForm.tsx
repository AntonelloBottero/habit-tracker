import { useEffect, useState, useMemo, useRef } from "react"
import { CalendarCheck } from '@project-lary/react-material-symbols-700-rounded'
import { DbResourceSchema, eventsModel, EventsSchema, HabitsSchema, SlotsSchema } from "@/db/DbClass"
import useForm, { Rules, validators } from "@/hooks/useForm"
import CardsInput from "@/components/CardsInput"
import HabitsCardHeader from "@/components/HabitsCardHeader"
import SlotsCompletionChip from "@/components/SlotsCompletionChip"
import { CalendarToday } from "@project-lary/react-material-symbols-700-rounded"
import InputWrapper from "@/components/InputWrapper"
import CheckboxBtn from "@/components/CheckboxBtn"
import ConfirmModal from '@/components/ConfirmModal'
import { DateTime } from "luxon"
import useHabits from "@/hooks/useHabits"
import { ConfirmModalRef } from '@/app/types'

type Values = Partial<DbResourceSchema<EventsSchema>>

interface Props {
    values?: Values
    onSave?: () => never | void
    onDelete?: () => never | void
}

type SelectableHabit = DbResourceSchema<HabitsSchema> & {
  slot: DbResourceSchema<SlotsSchema>
}

const rules: Rules = {
  habit_id: [validators.required],
  datetime: [validators.required],
  completed: [validators.numeric]
}

export default function FormEvents({ values, onSave, onDelete }: Props) {
  const { fetchSelectableHabits, saveEvent, deleteEvent: _deleteEvent } = useHabits()

  // --- useForm ---
  const { model, changeField, init, errorMessages, handleFormSubmit } = useForm({ defaultValues: eventsModel, rules, onSubmit })
  useEffect(() => {
    init(values)
  }, [values])

  const id = useMemo(()=> {
    return values?.id
  }, [values])
  const isNew = useMemo(() => {
    return !id
  }, [values])

  // --- datetime ---
  const datetimeFormatted = useMemo(() => {
    if(!model?.datetime) { return '' }
    return DateTime.fromISO(model.datetime).toFormat('dd/MM/yyyy HH:ii')
  }, [model])

  // --- Selectable habits ---
  const [selectableHabits, setSelectableHabits] = useState<SelectableHabit[]>([])
  useEffect(() => {
    try {
      fetchSelectableHabits(values?.datetime ?? '').then(setSelectableHabits)
    } catch(error) {
      console.error(error)
      setSelectableHabits([])
    }
  }, [values])

  // --- Habit enough amount ---
  const selectedHabit = useMemo(() => {
    return selectableHabits.find(habit => habit.id === model.habit_id)
  }, [selectableHabits, model])

  const enoughAmount = useMemo(() => {
    return selectedHabit?.enough_amount
  }, [selectedHabit])

  // --- Save ---
  const slot_id = useMemo(() => {
    return selectedHabit?.slot?.id
  }, [selectedHabit])
  const [loading, setLoading] = useState(false)
  async function onSubmit() {
    if(!isNew || loading || (enoughAmount && !model.completed)) { return undefined }
    setLoading(true)
    try {
      await saveEvent(model, slot_id as number)
      if(onSave) {
        onSave()
      }
    } catch(error) {
      console.error(error)
      // TODO: notify error to user
    }
    setLoading(false)
  }

  // --- Delete ---
  const confirmDeleteModalRef = useRef<ConfirmModalRef>(null)
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false)
  async function deleteEvent() {
    if(loadingDelete || isNew) { return undefined }
    const confirmed = await confirmDeleteModalRef.current?.confirm()
    if(!confirmed) { return undefined }

    setLoadingDelete(true)
    try{
      await deleteItem(id as number)
      if(onDelete) {
        onDelete()
      }
    } catch(error) {
      console.error(error)
      // TODO: notify error to user
    }
    setLoadingDelete(false)
  }

  return (
    <form onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-x-3">
      <div>
        <InputWrapper errorMessages={errorMessages.datetime} label="Date & time" input={(
          <input
            id="datetime"
            type="text"
            name="datetime"
            className="grow w-full ht-form-input"
            placeholder="Date & time of your check"
            value={datetimeFormatted}
            readOnly
          />
        )}/>
      </div>
      <div>
        <InputWrapper
          errorMessages={errorMessages.habit_id}
          label="Select the habit"
          input={(
            <CardsInput
              value={model.habit_id}
              onChange={e => changeField('habit_id', e.target.value)}
              items={selectableHabits}
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

      {enoughAmount && (
        <div>
          <InputWrapper label="Did enough?" input={(
            <div className="w-full rounded-lg flex items-center outline-1 -outline-offset-1 outline-white gap-2">
              <CheckboxBtn
                id="completed"
                name="completed"
                defaultChecked={!!model.completed}
                onChange={e => changeField('completed', e.target.checked ? 1 : 0)}
              />
              <div className="text-sm">
                {enoughAmount}
              </div>
            </div>
          )} />
        </div>
      )}

      <div className="flex justify-end items-center gap-4">
        {isNew ? (
          <>
          {enoughAmount && !model.completed && (
            <div className="text-sm text-gray-600">
              You have to do more...
            </div>
          )}
          <button type="submit" className="ht-btn ht-btn--size-large ht-interaction bg-primary shadow-ht" disabled={!!enoughAmount && !model.completed}>
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
}