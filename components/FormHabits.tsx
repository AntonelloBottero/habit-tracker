import { useState, useEffect } from 'react'
import InputWrapper from '@/components/InputWrapper'
import ColorPicker from '@/components/ColorPicker'
import useForm, {ErrorMessages, Rules, validators} from '@/hooks/useForm'

interface Values {
    name?: string
    color?: string
}
interface Props {
    values?: Values
}

export default function FormHabits({ values }: Props) {
  // values
  const [name, setName] = useState<string>('')
  const [color, setColor] = useState<string>('')
  const initFormModel = (values?: Values) => {
    setName(values?.name ?? '')
    setColor(values?.color ?? '')
  }
  // error messages
  const rules: Rules = {
    name: { value: name, validators: [validators.required] },
    color: { value: color, validators: [validators.required] }
  }
  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({})
  const resetErrorMessages = () => {
    setErrorMessages({})
  }
  // useForm
  const { init } = useForm({ resetErrorMessages, rules })
  useEffect(() => {
    init()
    initFormModel(values)
  }, [values])

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <InputWrapper errorMessages={errorMessages.name} label="Name" input={(
          <input
            id="name"
            type="text"
            name="name"
            className="grow w-full rounded-lg px-4 py-2 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 rounded-full"
            placeholder="Insert the name of the habit"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}/>
      </div>
      <div>
        <InputWrapper errorMessages={errorMessages.color} label="Color" input={(
          <ColorPicker
            id="color"
            name="color"
            className="grow w-full rounded-lg px-4 py-2 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 rounded-full"
            value={color}
            onChange={e => setColor(e.target.value)} />
        )}
        />
      </div>
    </div>
  )
}