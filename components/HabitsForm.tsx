// Habits form module - stores, updates, deletes through ref controls
import { useRef, forwardRef, useImperativeHandle } from 'react'
import InputWrapper from '@/components/InputWrapper'
import ColorPicker from '@/components/ColorPicker'
import CheckboxBtn from '@/components/CheckboxBtn'
import ConfirmModal from '@/components/ConfirmModal'
import { ColorPickerRef, ConfirmModalRef } from '@/app/types'
import { CheckCircle, Info } from '@project-lary/react-material-symbols-700-rounded'
import { HabitRawProps } from '@/src/habits/mappers/HabitMapper'
import useHabitCrud from '@/src/habits/adapters/useHabitsCrud'

interface Ref {
  store: (values?: Partial<HabitRawProps>) => void
  update: (id: string | number) => Promise<void>
}

interface Props {
  onSave?: (values: HabitRawProps) => never | void
  onDelete?: () => never | void
}

// TODO: expose store and update methods
const HabitsForm = forwardRef<Ref, Props>(({ onSave, onDelete }: Props, ref) => {
  // --- useHabitsCrud ---
  const {
    form,
    store,
    update,
    deleteHabit: adapterDeleteHabit,
    // loadingSave,
    loadingDelete,
    granularities,
    granularityTimes,
    isNew,
    canEdit
  } = useHabitCrud({ onSave, onDelete })

  // --- Color picker ref ---
  const colorPickerRef = useRef<ColorPickerRef>(null)
  // TODO: refactor on onSave
  // await colorPickerRef.current?.updateUserColorsOption(model.color)

  // --- Delete ---
  const confirmDeleteModalRef = useRef<ConfirmModalRef>(null)
  async function deleteHabit() {
    if(loadingDelete || isNew) { return undefined }
    const confirmed = await confirmDeleteModalRef.current?.confirm()
    if(!confirmed) { return undefined }

    try{
      await adapterDeleteHabit()
    } catch(error) {
      console.error(error)
      // TODO: notify error to user
    }
  }

  useImperativeHandle(ref, () => ({
    store,
    update
  }))

  return (
    <form onSubmit={form.handleFormSubmit} className="grid grid-cols-2 gap-x-3">
      <div className="col-span-2">
        <InputWrapper errorMessages={form.errorMessages.name} label="Name" input={(
          <input
            id="name"
            type="text"
            name="name"
            className="grow w-full ht-form-input"
            placeholder="Insert the name of the habit"
            value={form.model.name}
            onChange={e => form.changeField('name', e.target.value)}
          />
        )}/>
      </div>
      <div className="col-span-2">
        <InputWrapper errorMessages={form.errorMessages.color} label="Color" input={(
          <ColorPicker
            ref={colorPickerRef}
            id="color"
            name="color"
            className="ht-form-input !py-1"
            value={form.model.color}
            onChange={e => form.changeField('color', e.target.value)}
          />
        )}
        />
      </div>

      <div>
        <InputWrapper errorMessages={form.errorMessages.granularity} label="You should check" input={(
          <select
            id="granularity"
            name="granularity"
            className="ht-form-input w-full grow"
            value={form.model.granularity}
            onChange={e => form.changeField('granularity', e.target.value)}
          >
            {granularities.map(granularity => <option key={granularity} value={granularity}>{granularity}</option>)}
          </select>
        )} />
      </div>
      {form.model.granularity === 'daily'
        ? (
          <div>
            <InputWrapper errorMessages={form.errorMessages.include_weekends} label="Including weekends?" input={(
              <CheckboxBtn
                id="include_weekends"
                name="include_weekends"
                defaultChecked={form.model.include_weekends}
                onChange={e => form.changeField('include_weekends', e.target.checked)}
              />
            )} />
          </div>
        )
        : (
          <div>
            <InputWrapper errorMessages={form.errorMessages.granularity_times} label="Check it" input={(
              <select
                id="granularity_times"
                name="granularity_times"
                className="ht-form-input w-full grow"
                value={form.model.granularity_times}
                onChange={e => form.changeField('granularity_times', e.target.value)}
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
          <InputWrapper errorMessages={form.errorMessages.enough_amount} input={(
            <input
              id="enough_amount"
              type="text"
              name="enough_amount"
              className="grow w-full ht-form-input"
              placeholder="2lt of water, 10€ saved..."
              value={form.model.enough_amount}
              onChange={e => form.changeField('enough_amount', e.target.value)}
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
              <ConfirmModal text={canEdit ? 'Deleting this habit will delete every attached event and slot.' : undefined} ref={confirmDeleteModalRef} />
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
})

export default HabitsForm