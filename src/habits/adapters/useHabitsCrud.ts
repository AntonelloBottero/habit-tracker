import { useInfrastructure } from "@/src/shared/infrastructure/InfrastructureContext"
import { ShowHabit } from "../use-cases/ShowHabit"
import { StoreHabit } from "../use-cases/StoreHabit"
import { UpdateHabit } from "../use-cases/UpdateHabit"
import { DeleteHabit } from "../use-cases/DeleteHabit"
import { HabitMapper, type HabitRawProps } from "../mappers/HabitMapper"
import useForm, { validators } from "@/hooks/useForm"
import { Habit, HabitProps } from "../domain/Habit"
import { useRef } from "react"

interface Params {
    onSubmit?: () => never | void
}

export default function useHabitCrud({ onSubmit }: Params) {
    // Init Infrastructure
    const { habitGateway } = useInfrastructure()

    // Init Use Cases
    const showHabit = new ShowHabit(habitGateway)
    const storeHabit = new StoreHabit(habitGateway)
    const updateHabit = new UpdateHabit(habitGateway)
    const deleteHabit = new DeleteHabit(habitGateway)
    // init mapper
    const habitMapper = new HabitMapper()

    // Internal state
    const storedHabit = useRef<HabitRawProps | null>(null) // in case we are editing an existing habit we save it here

    // Form
    const defaultValues: Omit<HabitRawProps, 'id' | 'user_id'> = { // i and user_id are not intended to be edited directly, so we omit them from defaultValues
        type: 'good',
        name: '',
        color: '',
        granularity: 'daily',
        include_weekends: false,
        granularity_times: 0,
        enough_amount: '',
        manage_from: null
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

    function initStore() {
        form.init(defaultValues)
        storedHabit.current = null
    }
    async function store() {
        
    }
    
    async function initUpdate(id: string | number) {
        try {
            const _storedHabit = habitMapper.toRaw(await showHabit.execute(id))
            form.init(_storedHabit)
            storedHabit.current = _storedHabit
        } catch(error) {
            console.error(error)
        }
    }
    function update() {}

    // Utils
    const granularityTimes = Habit.getAllowedGranularityTimes(form.model.granularity).map(value => ({
        value,
        text: value === 1 ? '1 time' : `${value} times`
    }))

    return {
        form,
        initStore,
        store,
        initUpdate,
        update,
        granularityTimes,
    }
}