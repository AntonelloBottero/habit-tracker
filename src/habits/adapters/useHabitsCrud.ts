import { useInfrastructure } from "@/src/shared/infrastructure/InfrastructureContext"
import { ShowHabit } from "../use-cases/ShowHabit"
import { StoreHabit, StoreHabitInputDTO } from "../use-cases/StoreHabit"
import { UpdateHabit, UpdateHabitInputDTO } from "../use-cases/UpdateHabit"
import { DeleteHabit } from "../use-cases/DeleteHabit"
import { HabitMapper, type HabitRawProps } from "../mappers/HabitMapper"
import useForm, { validators } from "@/hooks/useForm"
import { Habit, type Granularity } from "../domain/Habit"
import { useState } from "react"

interface Params {
    onSave?: (vales: HabitRawProps) => never | void
    onDelete?: () => never | void
}

export default function useHabitCrud({ onSave, onDelete }: Params) {
    // Init Infrastructure
    const { habitGateway } = useInfrastructure()

    // init mapper
    const habitMapper = new HabitMapper()

    // Internal state - useState to allow ui to be rerendered accordingly
    const [storedHabit, setStoredHabit] = useState<HabitRawProps | null>(null) // in case we are editing an existing habit we save it here
    const [loadingSave, setLoadingSave] = useState<boolean>(false)
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false)

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

    // Actions
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

    // Delete
    // we delegate confirmation flows to ui components
    async function deleteHabit() {
        if(isNew) { return undefined }

        setLoadingDelete(true)
        try {
            await new DeleteHabit(habitGateway).execute(storedHabit.id)
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
        deleteHabit,
        loadingSave,
        loadingDelete,
        granularities,
        granularityTimes,
        isNew,
        canEdit
    }
}