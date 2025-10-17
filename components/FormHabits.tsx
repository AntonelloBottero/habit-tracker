import { useEffect } from 'react'
import InputWrapper from '@/components/InputWrapper'
import ColorPicker from '@/components/ColorPicker'
import useForm, {Model, Rules, validators} from '@/hooks/useForm'

const defaultValues: Model = {
  name: '',
  color: ''
}
type Values = Partial<Model>

interface Props {
    values?: Values
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
            className="grow w-full ht-form-input"
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
            className="ht-form-input !py-1 !px-3"
            value={model.color}
            onChange={e => changeField('color', e.target.value)}
          />
        )}
        />
      </div>
    </div>
  )
}