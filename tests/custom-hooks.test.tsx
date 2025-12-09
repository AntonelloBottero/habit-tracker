import { render, act, renderHook, waitFor } from "@testing-library/react"
import { DateTime } from 'luxon'
import { DbProvider } from '@/db/useDb'
import DbClass, { SlotsSchema, type HabitsSchema } from '@/db/DbClass'

// --- useForm ---
import useForm, { validators } from '@/hooks/useForm'
const defaultValues = {
  name: '',
  last_name: 'Rossi',
  count: 2
}
const rules = {
  name: [validators.required],
  last_name: [validators.required],
  count: [validators.numeric]
}
describe("useForm", () => {
  test('model init equals defaultValues', () => {
    const useFormRendered = renderHook(() => useForm({ defaultValues }))
    expect(JSON.stringify(useFormRendered.result.current.model)).toBe(JSON.stringify(defaultValues))
  })

  test('model batch update', async () => {
    const values = { // order of properties is important
      name: 'Mario',
      count: 5
    }
    const useFormRendered = renderHook(() => useForm({ defaultValues }))
    act(() => {
      useFormRendered.result.current.init(values)
    })
    await waitFor(() => {
      expect(useFormRendered.result.current.model.name).toBe(values.name)
      expect(useFormRendered.result.current.model.last_name).toBe(defaultValues.last_name) // last_name should be kept as defaultValue, since not included in values partial
    })
  })

  test('model update of single field', async () => {
    const useFormRendered = renderHook(() => useForm({ defaultValues }))
    act(() => {
      useFormRendered.result.current.changeField('count', 3)
    })
    await waitFor(() => {
      expect(useFormRendered.result.current.model.count).toBe(3)
    })
  })

  test('Validation of whole model', async () => {
    const useFormRendered = renderHook(() => useForm({ defaultValues, rules }))
    act(() => {
      useFormRendered.result.current.validate()
    })
    await waitFor(() => {
      expect(useFormRendered.result.current.errorMessages.name?.length).toBe(1)
      expect(useFormRendered.result.current.errorMessages.last_name?.length).toBe(0)
    })
  })

  test('Validation of specific fields', async () => {
    const useFormRendered = renderHook(() => useForm({ defaultValues, rules }))
    act(() => {
      useFormRendered.result.current.validate()
    })
    await waitFor(() => {
      act(() => {
        useFormRendered.result.current.changeField('last_name', '')
      })
    })
    await waitFor(() => {
      expect(useFormRendered.result.current.errorMessages.name?.length).toBe(1) // checks if name kept errorMessages even after validation of specific field
      expect(useFormRendered.result.current.errorMessages.last_name?.length).toBe(1)
    })
  })
})

// --- useHabits ---
import useHabits from '@/hooks/useHabits'

interface HabitTestValues {
  calculateSlots: (habit: HabitsSchema) => SlotsSchema[]
}

const testDb = new DbClass('TestDatabase')
export const TestHabitConsumer = ({ onHookReady }: { onHookReady: (values: HabitTestValues) => void }) => {
  const { calculateSlots } = useHabits(DateTime.now().startOf('week').toISO(), DateTime.now().endOf('week').toISO())

  // callback that exposes methods to test
  onHookReady({ calculateSlots })

  return null
}

describe('useHabits', () => {
  beforeEach(async () => {
    await testDb.delete()
  })
  afterAll(() => {
    testDb.close()
  })

  test('calculateSlots', () => {
    const testHabit1: HabitsSchema = {
      type: 'good',
      name: 'Test habit 1',
      color: '#E6AF2E',
      granularity: 'daily',
      include_weekends: true,
      granularity_times: 3,
      enough_amount: '',
      manage_from: ''
    }

    let hookValues: HabitTestValues
    render(
      <DbProvider externalDb={testDb}>
        <TestHabitConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )

    waitFor(async () => {
      const testHabit1: HabitsSchema = {
        type: 'good',
        name: 'Test habit 1',
        color: '#E6AF2E',
        granularity: 'daily',
        include_weekends: true,
        granularity_times: 3,
        enough_amount: '',
        manage_from: ''
      }
      const slots1 = hookValues.calculateSlots(testHabit1)
      expect(slots1.length).toBe(7)
      expect(slots1[0].count).toBe(3)

      const testHabit2: HabitsSchema = {
        type: 'good',
        name: 'Test habit 2',
        color: '#E6AF2E',
        granularity: 'daily',
        include_weekends: false,
        granularity_times: 2,
        enough_amount: '',
        manage_from: ''
      }
      const slots2 = hookValues.calculateSlots(testHabit2)
      expect(slots2.length).toBe(5)
      expect(slots2[0].count).toBe(2)
    })
  })
})