import { useEffect } from 'react'
import InputWrapper from '@/components/InputWrapper'
import ColorPicker from '@/components/ColorPicker'
import useForm, {Model, Rules, validators} from '@/hooks/useForm'

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

const rules: Rules = {
  name: [validators.required],
  color: [validators.required]
}

export default function FormHabits({ values }: Props) {
  // useForm
  const { model, changeField, init, errorMessages } = useForm({ defaultValues, rules })
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
            className="ht-form-input grow w-full rounded-lg px-4 py-2 outline-1 -outline-offset-1 outline-gray-300 focus:outline-primary-500 placeholder:text-gray-400"
            placeholder="Insert the name of the habit"
            value={model.name}
            onChange={e => changeField('name', e.target.value)}
          />
        )}/>
      </div>
      <div className="col-span-2">
        <InputWrapper errorMessages={errorMessages.color} label="Color" input={(
          <ColorPicker
            id="color"
            name="color"
            className="rounded-lg px-4 py-2 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 rounded-full"
            value={model.color}
            onChange={e => changeField('color', e.target.value)}
          />
        )}
        />
      </div>
    </div>
  )
}