import { useState, useEffect } from 'react'
import InputWrapper from '@/components/InputWrapper'
import useForm, {ErrorMessages, String, validators} from '@/hooks/form'

interface Values {
    name?: String
}
interface Props {
    values?: Values | null | undefined
}

export default function FormHabits({ values }: Props) {
    const [name, setName] = useState<String>('')
    const initFormModel = (values?: Values) => {
        setName(values?.name ?? '')
    }
    const [errorMessages, setErrorMessages] = useState<ErrorMessages>({})
    const resetErrorMessages = () => {
        setErrorMessages({})
    }
    const { init } = useForm({initFormModel, resetErrorMessages})

    useEffect(() => {
        init(values)
    }, [values])

    return (
        <div className="grid grid-cols-2 gap-3">
            <div>
                <InputWrapper errorMessages={errorMessages.name} input={(
                    <input
                        id="name"
                        type="text"
                        name="name"
                        className="grow rounded-lg px-4 py-2 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 rounded-full"
                        placeholder="Your whatever goes here"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                )}/>
            </div>
        </div>
    )
}