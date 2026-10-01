import { useInfrastructure } from "@/src/shared/infrastructure/InfrastructureContext"
import { EventMapper, EventRawProps } from "../mappers/EventMapper"
import useForm, { validators } from "@/hooks/useForm"
import { HabitMapper, HabitRawProps } from "@/src/habits/mappers/HabitMapper"
import { IndexEventableSlots } from "@/src/slots/use-cases/IndexEventableSlots"
import { IndexHabitsByIds } from "@/src/habits/use-cases/IndexHabitsByIds"

interface Params {
    onSave?: (vales: EventRawProps) => never | void
    onDelete?: () => never | void
}

export default function useEventsCrud({ onSave, onDelete }: Params) {
    // Init Infrastructure
    const { eventGateway, slotGateway, habitGateway } = useInfrastructure()
    // init mapper
    const eventMapper = new EventMapper()
    const habitMapper = new HabitMapper()

    // Form
    const defaultValues: Omit<EventRawProps, 'id'> = {
        habit_id: '',
        date: '',
        completed: 0
    }
    const rules = {
      habit_id: [validators.required],
      datetime: [validators.required],
      completed: [validators.numeric]
    }
    const form = useForm({ defaultValues, rules, onSubmit })

    async function indexEventableHabits(date: Date): Promise<HabitRawProps[]> {
        const slots = await new IndexEventableSlots(slotGateway).execute({ date })

        const habitIds = [...(new Set(slots.map(slot => slot.habitId)))]
        const habits = await new IndexHabitsByIds(habitGateway).execute({ ids: habitIds })
        return habits.map(habit => habitMapper.toRaw(habit))
    }
}