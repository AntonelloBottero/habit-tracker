import { useEffect, useMemo } from 'react'
import InputWrapper from '@/components/InputWrapper'
import ColorPicker from '@/components/ColorPicker'
import useForm, {Model, Rules, validators} from '@/hooks/useForm'

const defaultValues: Model = {
  name: '',
  color: '',
  granularity: 'daily',
  include_weekends: ''
}
type Values = Partial<Model>

interface Props {
    values?: Values
}

const rules: Rules = {
  name: [validators.required],
  color: [validators.required],
  granularity: [validators.required],
  include_weekends: []
}

const granularities: string[] = ['daily', 'weekly', 'monthly', 'yearly']

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
            className="ht-form-input !py-1"
            value={model.color}
            onChange={e => changeField('color', e.target.value)}
          />
        )}
        />
      </div>

      <div>
        <InputWrapper errorMessages={errorMessages.name} label="You should check" input={(
          <select
            id="granularity"
            name="granularity"
            className="ht-form-input w-full grow"
            value={model.granularity}
            onChange={e => changeField('granularity', e.target.value)}
          >
            {granularities.map(granularity => <option key={granularity} value={granularity}>{granularity}</option>)}
          </select>
        )} />
      </div>
      {model.granularity === 'daily' && (
        <div>
          <label htmlFor="include_weekends flex">
            <span>Including weekends?</span>
          </label>
        </div>
      )}
    </div>
  )
}