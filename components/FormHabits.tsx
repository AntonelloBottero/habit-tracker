import { useState } from 'react'
import useForm, {ErrorMessages, String, validators} from '@/hooks/form'

interface Values {
    name?: String
}
interface Props {
    values: Values | null | undefined
}

export default function FormHabits({ values }: Props) {
    const [name, setName] = useState<String>(null)
    const initFormModel = (values?: Values) => {
        setName(values?.name)
    }
    const [errorMessages, setErrorMessages] = useState<ErrorMessages>({})
    const resetErrorMessages = () => {
        setErrorMessages({})
    }
    const { init } = useForm({initFormModel, resetErrorMessages})
}