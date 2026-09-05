import useForm from "@/hooks/useForm"
import { StoreHabit } from "../use-cases/StoreHabit"
import { UpdateHabit } from "../use-cases/UpdateHabit"

interface Params {
    onSubmit?: () => never | void
}

export default function useHabitCrud({ onSubmit }: Params) {
    const defaultValues = {}
    const rules = {}
    const form = useForm({ defaultValues, rules, onSubmit })

    function initStore() {

    }
    function store() {

    }
    
    function initUpdate() {

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