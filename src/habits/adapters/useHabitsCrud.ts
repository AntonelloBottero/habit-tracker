import { useInfrastructure } from "@/src/shared/infrastructure/InfrastructureContext"
import { ShowHabit } from "../use-cases/ShowHabit"
import { StoreHabit, StoreHabitInputDTO } from "../use-cases/StoreHabit"
import { UpdateHabit } from "../use-cases/UpdateHabit"
import { DeleteHabit } from "../use-cases/DeleteHabit"
import { HabitMapper, type HabitRawProps } from "../mappers/HabitMapper"
import useForm, { validators } from "@/hooks/useForm"
import { Habit, HabitProps, type Granularity } from "../domain/Habit"
import { useRef, useState } from "react"

interface Params {
    onSave?: () => never | void
}

export default function useHabitCrud({ onSave }: Params) {
    // Init Infrastructure
    const { habitGateway } = useInfrastructure()

    // Init Use Cases
    const updateHabit = new UpdateHabit(habitGateway)
    const deleteHabit = new DeleteHabit(habitGateway)
    // init mapper
    const habitMapper = new HabitMapper()

    // Internal state - useState to allow ui to be rerendered accordingly
    const [storedHabit, setStoredHabit] = useState<HabitRawProps | null>(null) // in case we are editing an existing habit we save it here
    const [loadingSave, setLoadingSave] = useState<boolean>(false)

    // Form
    const defaultValues: Omit<HabitRawProps, 'id' | 'user_id'> = { // id and user_id are not intended to be edited directly, so we omit them from defaultValues
        type: 'good',
        name: '',
        color: '',
        granularity: 'daily',
        include_weekends: false,
        granularity_times: 0,
        enough_amount: '',
        manage_from: null,
        last_setup_at: null
    }
    const rules = {
      name: [validators.required],
      color: [validators.required, validators.hex],
      granularity: [validators.required],
      include_weekends: [],
      granularity_times: [validators.numeric],
      enough_amount: []
    }
    const form = useForm({ defaultValues, rules, onSubmit })

    function store(values?: Partial<HabitRawProps>) {
        form.init(values)
        setStoredHabit(null)
    }
    async function update(id: string | number) {
        try {
            const _storedHabit = habitMapper.toRaw(await new ShowHabit(habitGateway).execute(id))
            form.init(_storedHabit)
            setStoredHabit(_storedHabit)
        } catch(error) {
            console.error(error)
        }
    }

    async function onSubmit() {
        setLoadingSave(true)
        try {
            if(!storedHabit?.id) {
                await new StoreHabit(habitGateway).execute(habitMapper.toDomain(form.model) as StoreHabitInputDTO)
            }
            if(onSave) {
                onSave()
            }
        } catch(error) {
            console.error(error)
        }
        setLoadingSave(false)
    }

    // Utils
    const granularities: Granularity[] = Habit.getGranularities()
    const granularityTimes = Habit.getAllowedGranularityTimes(form.model.granularity).map(value => ({
        value,
        text: value === 1 ? '1 time' : `${value} times`
    }))
    // those change based on hook's states
    const isNew = !storedHabit?.id
    // TODO: new use case
    const setupDone = storedHabit?.last_setup_at && storedHabit.last_setup_at < new Date().toISOString()
    const canEdit = isNew || !setupDone

    return {
        form,
        store,
        update,
        loadingSave,
        granularities,
        granularityTimes,
        isNew,
        canEdit
    }
}