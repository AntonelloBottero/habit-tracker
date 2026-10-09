import { useInfrastructure } from "@/src/shared/infrastructure/InfrastructureContext"
import { EventMapper, EventRawProps } from "../mappers/EventMapper"
import useForm, { validators } from "@/hooks/useForm"
import { HabitMapper, HabitRawProps } from "@/src/habits/mappers/HabitMapper"
import { IndexEventableSlots } from "@/src/slots/use-cases/IndexEventableSlots"
import { IndexHabitsByIds } from "@/src/habits/use-cases/IndexHabitsByIds"
import { EventProps } from "../domain/Event"
import { useRef, useState } from "react"
import { ShowEvent } from "../use-cases/ShowEvent"
import { HabitProps } from "@/src/habits/domain/Habit"
import { StoreEvent, StoreEventInputDTO } from "../use-cases/StoreEvent"
import { UpdateEvent, UpdateEventInputDTO } from "../use-cases/UpdateEvent"
import { DeleteHabit } from "../use-cases/DeleteEvent"
import { SlotMapper, SlotRawProps } from "@/src/slots/mappers/SlotMapper"
import { SlotProps } from "@/src/slots/domain/Slot"

interface Params {
    onSave?: (vales: EventRawProps) => never | void
    onDelete?: () => never | void
}

// Form - outside to prevent reinit at every rerender
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

// init mapper - outside to prevent reinit at every rerender
const eventMapper = new EventMapper()
const habitMapper = new HabitMapper()
const slotMapper = new SlotMapper()

export default function useEventsCrud({ onSave, onDelete }: Params) {
    // Init Infrastructure
    const { eventGateway, slotGateway, habitGateway } = useInfrastructure()

    // Internal state - useState to allow ui to be rerendered accordingly
    const [eventableHabits, setEventableHabits] = useState<(HabitRawProps & { slot: SlotRawProps })[] | []>([])
    const [storedEvent, setStoredEvent] = useState<EventProps | null>(null) // in case we are editing an existing habit we save it here
    const [loadingSave, setLoadingSave] = useState<boolean>(false)
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false)

    // Form
    const form = useForm({ defaultValues, rules, onSubmit })

    // Utils
    const isNew = !storedEvent?.id
    async function indexEventableHabits(date: Date): Promise<void> {
        const slots = await new IndexEventableSlots(slotGateway).execute({ date })

        const habitIds = [...(new Set(slots.map(slot => slot.habitId)))]
        const habits = await new IndexHabitsByIds(habitGateway).execute({ ids: habitIds })
        setEventableHabits(habits.map(habit => ({
            ...habitMapper.toRaw(habit),
            slot: slotMapper.toRaw(slots.find(slot => slot.habitId === habit.id) as SlotProps)
        })))
    }

    const selectedHabit = eventableHabits.find(habit => habit.id === form.model.habit_id)

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
                values = await new StoreEvent(eventGateway).execute(eventMapper.toDomain(form.model) as StoreEventInputDTO)
            } else {
                values = await new UpdateEvent(eventGateway).execute(storedEvent.id, eventMapper.toDomain(form.model) as UpdateEventInputDTO)
            }
            if(onSave) {
                onSave(eventMapper.toRaw(values))
            }
        } catch(error) {
            console.error(error)
        }
        setLoadingSave(false)
    }

    // Delete
    // we delegate confirmation flows to ui components
    async function deleteEvent() {
        if(isNew) { return undefined }

        setLoadingDelete(true)
        try {
            await new DeleteHabit(eventGateway).execute(storedEvent.id)
            if(onDelete) {
                onDelete()
            }
        } catch(error) {
            console.error(error)
        }
        setLoadingDelete(false)
    }

    return {
        form,
        store,
        update,
        deleteEvent,
        loadingSave,
        loadingDelete,
        isNew,
        eventableHabits,
        selectedHabit
    }
}