import { useEffect, useState, useMemo } from "react"
import { DbResourceSchema, eventsModel, EventsSchema, habitsModel, HabitsSchema, slotsModel, SlotsSchema } from "@/db/DbClass"
import useDbCrud from "@/db/useDbCrud"
import useForm, { Rules, validators } from "@/hooks/useForm"
import CardsInput from "@/components/CardsInput"
import HabitsCardHeader from "@/components/HabitsCardHeader"
import SlotsCompletionChip from "@/components/SlotsCompletionChip"
import { CalendarToday } from "@project-lary/react-material-symbols-700-rounded"
import InputWrapper from "@/components/InputWrapper"
import CheckboxBtn from "@/components/CheckboxBtn"
import { DateTime } from "luxon"

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
  completed: [validators.required, validators.number]
}

export default function FormEvents({ values, onSave, onDelete }: Props) {
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
  const slotsCrud = useDbCrud({ table: 'slots', model: slotsModel })
  const habitsCrud = useDbCrud({ table: 'habits', model: habitsModel })

  const [selectableHabits, setSelectableHabits] = useState<SelectableHabit[]>([])
  async function fetchSelectableHabits(datetime: string) {
    try {
      const habits = await habitsCrud.index()
      const slots = await slotsCrud.index(item => item.active_to >= datetime && item.completion < item.count, { field: 'active_to' }) // fetches slots not yet completed, sorted by active_to
      setSelectableHabits(habits.map(habit => {
        const slot = slots.find(slot => slot.habit_id === habit.id) // since slots are sorted by active_to, the first one in the array is the most appropriate to be selected, given the datetime of the event
        return slot ? { ...habit, slot } : null
      }).filter(Boolean) as SelectableHabit[])
    } catch(error) {
      console.error(error)
      setSelectableHabits([])
    }
  }

  useEffect(() => {
    fetchSelectableHabits(values?.datetime ?? '')
  }, [values])

  // --- Habit enough amount ---
  const selectedHabit = useMemo(() => {
    return selectableHabits.find(habit => habit.id === model.habit_id)
  }, [selectableHabits, model])
  const enoughAmount = useMemo(() => {
    return selectedHabit?.enough_amount
  }, [selectedHabit])

  const [enoughAmountChecked, setEnoughAmountChecked] = useState<boolean>(false)
  useEffect(() => { // every time an habit is selected we must ask the user to confirm he did enough
    setEnoughAmountChecked(false)
  }, [enoughAmount])

  const enoughAmountErrorMessages = useMemo(() => {
    return enoughAmount && !enoughAmountChecked ? [
      'You have to do more...'
    ] : []
  }, [enoughAmount, enoughAmountChecked])

  function onSubmit() {}

  return (
    <form className="grid grid-cols-1 gap-3">
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
          errorMessages={errorMessages.granularity}
          label="Select the habit"
          input={(
            <CardsInput
              value={model.habit_id}
              onChange={e => changeField('habit_id', e.target.value)}
              items={selectableHabits}
              content={(item) => (
                <>
                  <HabitsCardHeader habit={item} dense={true} />
                  <div className="flex items-center flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-sm mr-1">
                      <CalendarToday />
                      <span>
                        {item.granularity}
                        {item.granularity_times > 1 && ` (${item.granularity_times} times)`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <SlotsCompletionChip completion={item.slot.completion} count={item.slot.count} />
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
          <InputWrapper errorMessages={enoughAmountErrorMessages} label="Did enough?" input={(
            <div className="w-full rounded-lg flex items-center gap-2">
              <CheckboxBtn
                id="enough_amount"
                name="enough_amount"
                defaultChecked={enoughAmountChecked}
                onChange={e => setEnoughAmountChecked(e.target.checked)}
              />
              <div className="text-sm">
                {enoughAmount}
              </div>
            </div>
          )} />
        </div>
      )}
    </form>
  )
}