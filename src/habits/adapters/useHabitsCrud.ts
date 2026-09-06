import { StoreHabit } from "../use-cases/StoreHabit"
import { UpdateHabit } from "../use-cases/UpdateHabit"
import { ShowHabit } from "../use-cases/ShowHabit"
import { type HabitRawProps } from "../mappers/HabitMapper"
import useForm, { validators } from "@/hooks/useForm"

interface Params {
    onSubmit?: () => never | void
}

export default function useHabitCrud({ onSubmit }: Params) {
    // Form
    const defaultValues: HabitRawProps = {
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
    }
    async function store() {

    }

    async function initUpdate(id: string | number) {
        try {
            

        }
    }
    function update() {}

    return {
        form,
        initStore,
        store,
        initUpdate,
        update,
    }
}