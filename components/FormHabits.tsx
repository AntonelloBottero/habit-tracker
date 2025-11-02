import { useEffect, useMemo, type ChangeEvent } from 'react'
import InputWrapper from '@/components/InputWrapper'
import ColorPicker from '@/components/ColorPicker'
import CheckboxBtn from '@/components/CheckboxBtn'
import useForm, {Model, Rules, validators} from '@/hooks/useForm'

interface HabitsData {
  name: string
  color: string
  granularity: string
  include_weekends: boolean
  granularity_items: number
}
type HabitsModel = Model<HabitsData>

const defaultValues: HabitsModel = {
  name: '',
  color: '',
  granularity: 'daily',
  include_weekends: false,
  granularity_times: 0
}
type Values = Partial<HabitsModel>

interface Props {
    values?: Values
}

const rules: Rules = {
  name: [validators.required],
  color: [validators.required],
  granularity: [validators.required],
  include_weekends: [],
  granularity_times: [validators.required]
}

const granularities: string[] = ['daily', 'weekly', 'monthly', 'yearly']

export default function FormHabits({ values }: Props) {
  // --- useForm ---
  const { model, changeField, init, errorMessages } = useForm({ defaultValues, rules })
  useEffect(() => {
    init()
  }, [values])

  // --- granularity times ---
  const granularityTimes = useMemo(() => {
    let count = 1
    switch(model.granularity) {
    case 'weekly':
      count = 3
      break
    case 'monthly':
      count = 5
      break
    case 'early':
      count = 8
      break
    }
    return Array.from(Array(count).keys()).map(i => {
      const time = i + 1
      return {
        value: time,
        text: time === 1 ? '1 time' : `${time} times`
      }
    })
  }, [model.granularity])
  // changing granularity resets granularity_times
  const handleChangeGranularity = (e: ChangeEvent<HTMLInputElement>): void => {
    changeField('granularity', e.target.value)
    changeField('granularity_times', 1)
  }

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
            onChange={handleChangeGranularity}
          >
            {granularities.map(granularity => <option key={granularity} value={granularity}>{granularity}</option>)}
          </select>
        )} />
      </div>
      {model.granularity === 'daily'
        ? (
          <div>
            <InputWrapper errorMessages={errorMessages.include_weekends} label="Including weekends?" input={(
              <CheckboxBtn
                id="include_weekends"
                name="include_weekends"
                defaultChecked={model.include_weekends}
                onChange={e => changeField('include_weekends', e.target.checked)}
              />
            )} />
          </div>
        )
        : (
          <div>
            <InputWrapper errorMessages={errorMessages.granularity_times} label="Check it" input={(
              <select
                id="granularity_times"
                name="granularity_times"
                className="ht-form-input w-full grow"
                value={model.granularity_times}
                onChange={e => changeField('granularity_times', e.target.value)}
              >
                {granularityTimes.map(granularityTime => <option key={granularityTime.value} value={granularityTime.value}>{granularityTime.text}</option>)}
              </select>
            )} />
          </div>
        )}
    </div>
  )
}