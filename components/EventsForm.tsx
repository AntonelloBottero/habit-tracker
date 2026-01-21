import { useEffect, useState } from "react"
import { DbResourceSchema, EventsSchema, habitsModel, HabitsSchema, slotsModel, SlotsSchema } from "@/db/DbClass"
import useDbCrud from "@/db/useDbCrud"
import { Rules, validators } from "@/hooks/useForm"
import CardsInput from "./CardsInput"
import HabitsCardHeader from "./HabitsCardHeader"

type Values = Partial<DbResourceSchema<EventsSchema>>

interface Props {
    values?: Values
    onSave?: () => never | void
    onDelete?: () => never | void
}

type SelectableSlot = DbResourceSchema<SlotsSchema> & {
  habit: DbResourceSchema<HabitsSchema>
}

const rules: Rules = {
  slot_id: [validators.required],
  datetime: [validators.required],
  completed: [validators.required, validators.number]
}

export default function FormEvents({ values, onSave, onDelete }: Props) {
  // --- Selectable slots ---
  const slotsCrud = useDbCrud({ table: 'slots', model: slotsModel })
  const habitsCrud = useDbCrud({ table: 'habits', model: habitsModel })

  const [selectableSlots, setSelectableSlots] = useState<SelectableSlot[]>([])
  async function fetchSelectableSlots(datetime: string) {
    try {
      const habits = await habitsCrud.index()
      const slots = await slotsCrud.index(item => item.active_to >= datetime && item.completion < item.count, { field: 'active_to' }) // fetches slots not yet completed, sorted by active_to
      setSelectableSlots(habits.map(habit => {
        const slot = slots.find(slot => slot.habit_id === habit.id) // since slots are sorted by active_to, the first one in the array is the most appropriate to be selected, given the datetime of the event
        return slot ? { ...slot, name: habit.name, habit } : null
      }).filter(Boolean) as SelectableSlot[])
    } catch(error) {
      console.error(error)
      setSelectableSlots([])
    }
  }

  useEffect(() => {
    fetchSelectableSlots(values?.datetime ?? '')
  }, [values])

  return (
    <form className="grid grid-cols-1 gap-3">
      <div>
        <CardsInput items={selectableSlots} content={(item) => (
          <HabitsCardHeader habit={item.habit} />
        )} />
      </div>
    </form>
  )
}