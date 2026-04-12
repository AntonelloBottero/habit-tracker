import { useState, useEffect, type ChangeEvent, useRef } from 'react'
import InputWrapper from '@/components/InputWrapper'
import ColorPicker from '@/components/ColorPicker'
import CheckboxBtn from '@/components/CheckboxBtn'
import { habitsModel, type HabitsSchema, type DbResourceSchema } from '@/db/DbClass'
import useForm, {Rules, validators} from '@/hooks/useForm'
import useDb from "@/db/useDb"
import useDbCrud from '@/db/useDbCrud'
import useHabits from '@/hooks/useHabits'
import ConfirmModal from '@/components/ConfirmModal'
import { ColorPickerRef, ConfirmModalRef } from '@/app/types'
import { CheckCircle, Info } from '@project-lary/react-material-symbols-700-rounded'
import { DateTime } from 'luxon'

type Values = Partial<DbResourceSchema<HabitsSchema>>

interface Props {
    values?: Values
    onSave?: () => never | void
    onDelete?: () => never | void
}

const rules: Rules = {
  name: [validators.required],
  color: [validators.required, validators.hex],
  granularity: [validators.required],
  include_weekends: [],
  granularity_times: [validators.numeric],
  enough_amount: []
}

const granularities: string[] = ['daily', 'weekly', 'monthly', 'yearly']

export default function FormHabits({ values, onSave, onDelete }: Props) {
  const { options } = useDb()
  const setupDone = (options.current.last_setup_at || '') > DateTime.now().toISO()

  // --- useForm ---
  const { model, changeField, init, errorMessages, handleFormSubmit } = useForm({ defaultValues: habitsModel, rules, onSubmit })
  useEffect(() => {
    init(values)
  }, [values])

  const id = values?.id
  const isNew = !id
  const canEdit = isNew || !setupDone

  // --- granularity times ---
  const granularityTimes = (() => {
    let count = 1
    switch(model.granularity) {
    case 'weekly':
      count = 3
      break
    case 'monthly':
      count = 5
      break
    case 'yearly':
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
  })()
  // changing granularity resets granularity_times
  const handleChangeGranularity = (e: ChangeEvent<HTMLSelectElement>): void => {
    changeField('granularity', e.target.value)
    changeField('granularity_times', 1)
  }

  // --- Color picker ref ---
  const colorPickerRef = useRef<ColorPickerRef>(null)

  // --- Save data ---
  const { store, update } = useDbCrud('habits', habitsModel)
  const [loading, setLoading] = useState(false)
  async function onSubmit() {
    if(loading || !canEdit) { return undefined }
    setLoading(true)
    const fullModel = {
      ...model,
      granularity_times: Number(model.granularity_times || 1),
      manage_from: ''
    }
    try {
      if(!id) {
        await store(fullModel)
      } else {
        await update(id, fullModel)
      }
      await colorPickerRef.current?.updateUserColorsOption(model.color)
      if(onSave) {
        onSave()
      }
    } catch(error) {
      console.error(error)
      // TODO: notify error to user
    }
    setLoading(false)
  }

  // --- Delete ---
  const { deleteHabit: _deleteHabit } = useHabits()
  const confirmDeleteModalRef = useRef<ConfirmModalRef>(null)
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false)
  async function deleteHabit() {
    if(loadingDelete || isNew) { return undefined }
    const confirmed = await confirmDeleteModalRef.current?.confirm()
    if(!confirmed) { return undefined }

    setLoadingDelete(true)
    try{
      await _deleteHabit(id as number)
      if(onDelete) {
        onDelete()
      }
    } catch(error) {
      console.error(error)
      // TODO: notify error to user
    }
    setLoadingDelete(false)
  }


  return (
    <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-x-3">
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
            ref={colorPickerRef}
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
        <InputWrapper errorMessages={errorMessages.granularity} label="You should check" input={(
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

      <div className="col-span-2">
        <div className="outline-gray-200 outline-1 outline-offset-1 rounded-lg px-5 py-5 my-4">
          <div className="font-bold">
            What would it be enough?
          </div>
          <div className="text-xs text-gray-500 mb-2">
            Optional. If you don't have enough of simply checking your habit, declare here the right amount that would make you happy you reached.
          </div>
          <InputWrapper errorMessages={errorMessages.enough_amount} input={(
            <input
              id="enough_amount"
              type="text"
              name="enough_amount"
              className="grow w-full ht-form-input"
              placeholder="2lt of water, 10€ saved..."
              value={model.enough_amount}
              onChange={e => changeField('enough_amount', e.target.value)}
            />
          )}/>
        </div>

        {!canEdit && (
          <div className="col-span-2 my-4">
            <div className="flex items-start sm:items-start p-4 text-sm text-heading rounded-base bg-amber-50 border-1 border-amber-200 text-amber-800 rounded-lg" role="alert">
              <div className="mr-3">
                <Info className="text-lg" />
              </div>
              <div className="-mt-0.5">
                <p className="text-sm font-bold">
                  You can't update this habit
                </p>
                <p className="text-sm">
                  Once you start monitoring, settings of existing habits can't be changed. if you need to change an habit, you have to delete it first.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="col-span-2 flex justify-end items-center">
          {!isNew && (
            <>
              <button type="button" className="ht-btn ht-interaction rounded-lg bg-red-50 text-red-500 py-2 px-5 mr-2" onClick={deleteHabit}>
                Delete
              </button>
              <ConfirmModal text={setupDone ? 'Deleting this habit will delete every attached event and slot.' : undefined} ref={confirmDeleteModalRef} />
            </>
          )}
          {canEdit && (
            <button type="submit" className="ht-btn ht-interaction rounded-lg bg-green-200 shadow-ht py-2 px-5 outline-glass">
              <CheckCircle className="size-5" />
              Confirm
            </button>
          )}
        </div>
      </div>
    </form>
  )
}