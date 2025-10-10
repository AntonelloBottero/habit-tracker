import { useState, useEffect } from 'react'
import InputWrapper from '@/components/InputWrapper'
import ColorPicker from '@/components/ColorPicker'
import useForm, {Model, ErrorMessages, Rules, validators} from '@/hooks/useForm'

interface Values {
    name?: string
    color?: string
}
interface Props {
    values?: Values
}

const defaultValues: Model = {
  name: '',
  color: ''
}

export default function FormHabits({ values }: Props) {
  // error messages
  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({})
  const resetErrorMessages = () => {
    setErrorMessages({})
  }
  // useForm
  const { model, dispatchModel, init } = useForm({ resetErrorMessages, defaultValues })
  useEffect(() => {
    init()
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
            value={model.name}
            onChange={e => dispatchModel({name: 'name', value: e.target.value })}
          />
        )}/>
      </div>
      <div>
        <InputWrapper errorMessages={errorMessages.color} label="Color" input={(
          <ColorPicker
            id="color"
            name="color"
            className="grow w-full rounded-lg px-4 py-2 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 rounded-full"
            value={model.color}
            onChange={e => dispatchModel({name: 'name', value: e.target.value })}
          />
        )}
        />
      </div>
    </div>
  )
}