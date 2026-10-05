import { useInfrastructure } from "@/src/shared/infrastructure/InfrastructureContext"
import { EventMapper, EventRawProps } from "../mappers/EventMapper"
import useForm, { validators } from "@/hooks/useForm"
import { HabitMapper, HabitRawProps } from "@/src/habits/mappers/HabitMapper"
import { IndexEventableSlots } from "@/src/slots/use-cases/IndexEventableSlots"
import { IndexHabitsByIds } from "@/src/habits/use-cases/IndexHabitsByIds"
import { EventProps } from "../domain/Event"
import { useState } from "react"
import { ShowEvent } from "../use-cases/ShowEvent"
import { HabitProps } from "@/src/habits/domain/Habit"

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

    // Internal state - useState to allow ui to be rerendered accordingly
    const [eventableHabits, setEventableHabits] = useState<HabitRawProps[] | []>([])
    const [storedEvent, setStoredEvent] = useState<EventProps | null>(null) // in case we are editing an existing habit we save it here
    const [loadingSave, setLoadingSave] = useState<boolean>(false)
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false)

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

    // Utils
    const isNew = !storedEvent?.id
    async function indexEventableHabits(date: Date): Promise<void> {
        const slots = await new IndexEventableSlots(slotGateway).execute({ date })

        const habitIds = [...(new Set(slots.map(slot => slot.habitId)))]
        const habits = await new IndexHabitsByIds(habitGateway).execute({ ids: habitIds })
        setEventableHabits(habits.map(habit => habitMapper.toRaw(habit)))
    }

    // Actions
    function store(values?: Partial<EventRawProps>) {
        const valuesWithDefaults = {...values, date: values?.date ?? new Date().toISOString()}
        form.init(valuesWithDefaults)
        setStoredEvent(null)
        // date never changes by user interaction, is only inited. so we fetch the eventableHabits once every init
        indexEventableHabits(new Date(valuesWithDefaults.date))
    }

    async function update(id: string | number) {
        try {
            const _storedEvent = await new ShowEvent(eventGateway).execute(id)
            form.init(eventMapper.toRaw(_storedEvent))
            setStoredEvent(_storedEvent)
            // date never changes by user interaction, is only inited. so we fetch the eventableHabits once every init
            indexEventableHabits(new Date(_storedEvent.date))
        } catch(error) {
            console.error(error)
        }
    }

    async function onSubmit() {
        setLoadingSave(true)
        try {
            let values
            if(isNew) {
                values = await new StoreHabit(habitGateway).execute(habitMapper.toDomain(form.model) as StoreHabitInputDTO)
            } else {
                values = await new UpdateHabit(habitGateway).execute(storedHabit.id, habitMapper.toDomain(form.model) as UpdateHabitInputDTO)
            }
            if(onSave) {
                onSave(habitMapper.toRaw(values))
            }
        } catch(error) {
            console.error(error)
        }
        setLoadingSave(false)
    }
}