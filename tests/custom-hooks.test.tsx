import { render, act, renderHook, waitFor } from "@testing-library/react"
import { DateTime } from 'luxon'
import { DbProvider } from '@/db/useDb'
import DbClass, { SlotsSchema, type HabitsSchema, EventsSchema, DbResourceSchema } from '@/db/DbClass'

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
/* describe("useForm", () => {
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
}) */

// --- useHabits ---
import useHabits from '@/hooks/useHabits'
import { SelectableHabit } from "@/app/types"

interface HabitTestValues {
  calculateMonthlySlots: (habit: DbResourceSchema<HabitsSchema>, date: string) => SlotsSchema[]
  fetchManageableHabits: (mamange_from: string) => Promise<HabitsSchema[]>
  createMonthlySlots: (datetime: string) => Promise<void>
  fetchActiveSlots: (from: string, to: string) => Promise<SlotsSchema[]>
  fetchSelectableHabits: (datetime: string, now?: string | null) => Promise<SelectableHabit[]>
  fetchEvents: (from: string, to: string) => Promise<EventsSchema[]>
  saveEvent: (model: EventsSchema, slot_id: number, now?: string) => Promise<void>
}

const testDb = new DbClass('TestDatabase')
function TestHabitConsumer({ onHookReady }: { onHookReady: (values: HabitTestValues) => void }) {
  const { calculateMonthlySlots, fetchManageableHabits, createMonthlySlots, fetchActiveSlots, fetchSelectableHabits, fetchEvents, saveEvent } = useHabits()

  // callback that exposes methods to test
  onHookReady({ calculateMonthlySlots, fetchManageableHabits, createMonthlySlots, fetchActiveSlots, fetchSelectableHabits, fetchEvents, saveEvent })

  return null
}

describe('useHabits', () => {
  beforeEach(async () => {
    await testDb.delete()
  })
  afterAll(() => {
    testDb.close()
  })

  test('calculateMonthlySlots', async () => {
    let hookValues!: HabitTestValues
    render(
      <DbProvider externalDb={testDb}>
        <TestHabitConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )

    await waitFor(() => {
      expect(hookValues).toBeDefined()
    })

    const testHabit1 = {
      id: 1,
      type: 'good',
      name: 'Test habit 1',
      color: '#E6AF2E',
      granularity: 'weekly',
      include_weekends: true,
      granularity_times: 3,
      enough_amount: '',
      manage_from: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    } as DbResourceSchema<HabitsSchema>
    const slots1 = hookValues.calculateMonthlySlots(testHabit1, DateTime.now().toISO())
    expect(slots1.length).toBe(4)
    expect(slots1[0].count).toBe(3)

    const testHabit2 = {
      id: 2,
      type: 'good',
      name: 'Test habit 2',
      color: '#E6AF2E',
      granularity: 'monthly',
      include_weekends: false,
      granularity_times: 2,
      enough_amount: '',
      manage_from: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    } as DbResourceSchema<HabitsSchema>
    const slots2 = hookValues.calculateMonthlySlots(testHabit2, DateTime.now().toISO())
    expect(slots2.length).toBe(1)
    expect(slots2[0].count).toBe(2)
  })

  test('fetchManageableHabits', async () => {
    let hookValues!: HabitTestValues
    render(
      <DbProvider externalDb={testDb}>
        <TestHabitConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )
    await waitFor(() => {
      expect(hookValues).toBeDefined()
      expect(testDb.isOpen()).toBe(true)
    })

    const habits = Array.from(Array(6).keys()).map(index => ({
      type: 'good',
      name: `Test habit ${index + 1}`,
      color: '#E6AF2E',
      granularity: 'daily',
      include_weekends: false,
      granularity_times: 1,
      enough_amount: '',
      manage_from: DateTime.now().plus({ days: 1 }).minus({ weeks: index }).toISO()
    })) as DbResourceSchema<HabitsSchema>[]
    await testDb.habits.bulkAdd(habits)

    const manageableHabits = await hookValues.fetchManageableHabits(DateTime.now().startOf('month').toISO())

    waitFor(async () => {
      expect(manageableHabits.length).toBe(5)
      expect(manageableHabits[0].name).toBe('Test habit 2')
    })
  })

  test('fetchActiveSlots', async () => {
    let hookValues!: HabitTestValues
    render(
      <DbProvider externalDb={testDb}>
        <TestHabitConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )

    await waitFor(() => {
      expect(hookValues).toBeDefined()
    })
    await waitFor(() => {
      expect(testDb.isOpen()).toBe(true)
    })

    const slots = Array.from(Array(6).keys()).map(index => ({
      habit_id: null,
      event_ids: [],
      count: index + 1,
      completion: 0,
      active_to: DateTime.now().startOf('month').minus({ days: 1 }).plus({ days: index * 2 }).toISO(), // excludes first
      deleted_at: ''
    })) as unknown as DbResourceSchema<SlotsSchema>[]
    await testDb.slots.bulkAdd(slots)

    const activeSlots = await hookValues.fetchActiveSlots(DateTime.now().startOf('month').toISO(), DateTime.now().endOf('month').toISO())
    await waitFor(async () => {
      expect(activeSlots.length).toBe(5)
      expect(activeSlots[0].count).toBe(2)
    })
  })

  test('fetchEvents', async () => {
    let hookValues!: HabitTestValues
    render(
      <DbProvider externalDb={testDb}>
        <TestHabitConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )

    await waitFor(() => {
      expect(hookValues).toBeDefined()
    })
    await waitFor(() => {
      expect(testDb.isOpen()).toBe(true)
    })

    // Current week range (from set in Wrapper): Start of week to End of week
    const startOfWeek = DateTime.now().startOf('week')

    // 1. Event inside range
    const eventInside = {
      habit_id: 1,
      datetime: startOfWeek.plus({ days: 1 }).toISO(),
      completed: 1,
      deleted_at: ''
    } as DbResourceSchema<EventsSchema>

    // 2. Event outside range (before)
    const eventBefore = {
      habit_id: 1,
      datetime: startOfWeek.minus({ days: 1 }).toISO(),
      completed: 1,
      deleted_at: ''
    } as DbResourceSchema<EventsSchema>

    // 3. Event outside range (after)
    const eventAfter = {
      habit_id: 1,
      datetime: startOfWeek.plus({ weeks: 1, days: 1 }).toISO(),
      completed: 1,
      deleted_at: ''
    } as DbResourceSchema<EventsSchema>

    // 4. Soft deleted event inside range
    const eventDeleted = {
      habit_id: 1,
      datetime: startOfWeek.plus({ days: 2 }).toISO(),
      completed: 1,
      deleted_at: DateTime.now().toISO() // Should be ignored
    } as DbResourceSchema<EventsSchema> // Type assertion to bypass TS if Schema definition in test file is strict but DB allows extra props
    await testDb.events.bulkAdd([eventInside, eventBefore, eventAfter, eventDeleted])

    const fetchedEvents = await hookValues.fetchEvents(startOfWeek.toISO(), startOfWeek.endOf('week').toISO())
    await waitFor(async () => {
      expect(fetchedEvents.length).toBe(1)
      expect(fetchedEvents[0].datetime).toBe(eventInside.datetime)
      // Additional check to ensure soft delete works (if implementation supports it) or at least date filtering works.
    })
  })

  test('createMonthlySlots', async () => {
    const testHabit = {
      type: 'good',
      name: 'Test habit 1',
      color: '#E6AF2E',
      granularity: 'weekly',
      include_weekends: true,
      granularity_times: 3,
      enough_amount: '',
      manage_from: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    } as DbResourceSchema<HabitsSchema>
    const date = DateTime.now()

    let hookValues!: HabitTestValues
    render(
      <DbProvider externalDb={testDb}>
        <TestHabitConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )
    await waitFor(() => {
      expect(hookValues).toBeDefined()
      expect(testDb.isOpen()).toBe(true)
    })

    await testDb.habits.add(testHabit)
    await hookValues.createMonthlySlots(date.toISO())

    const habits = await testDb.habits.filter(item => item.manage_from === date.endOf('month').toISO()).toArray()
    await waitFor(() => {
      expect(habits.length).toBe(1)
      expect(habits[0].name).toBe(testHabit.name)
    })

    const slots = await testDb.slots.toArray()
    await waitFor(() => {
      expect(slots.length).toBe(4)
      expect(slots[1].habit_id).toBe(habits[0].id)
    })
  })

  test('fetchSelectableHabits', async () => {
    const testHabit1 = {
      type: 'good',
      name: 'Test habit 1',
      color: '#E6AF2E',
      granularity: 'monthly',
      include_weekends: true,
      granularity_times: 1,
      enough_amount: '',
      manage_from: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    } as DbResourceSchema<HabitsSchema>
    const testHabit2 = {
      type: 'good',
      name: 'Test habit 2',
      color: '#E6AF2E',
      granularity: 'daily',
      include_weekends: false,
      granularity_times: 1,
      enough_amount: '',
      manage_from: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    } as DbResourceSchema<HabitsSchema>
    const date = DateTime.now().set({ day: 15 }) // middle of month is suitable for tests

    let hookValues!: HabitTestValues
    render(
      <DbProvider externalDb={testDb}>
        <TestHabitConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )
    await waitFor(() => {
      expect(hookValues).toBeDefined()
      expect(testDb.isOpen()).toBe(true)
    })

    await testDb.habits.bulkAdd([testHabit1, testHabit2])
    await hookValues.createMonthlySlots(date.toISO())

    const selectableHabits = await hookValues.fetchSelectableHabits(date.toISO(), date.toISO())
    await waitFor(() => {
      expect(selectableHabits.length).toBe(2)
      expect(DateTime.fromISO(selectableHabits[1].slot.active_to).toFormat('dd/MM/yyyy')).toBe(date.toFormat('dd/MM/yyyy')) // daily slots are placed in each day, so the selectable daily slot is today's slot
      expect(DateTime.fromISO(selectableHabits[0].slot.active_to).toFormat('dd/MM/yyyy')).toBe(date.endOf('month').toFormat('dd/MM/yyyy'))
    })
  })

  test('saveEvent', async () => {
    const testHabit1 = {
      type: 'good',
      name: 'Test habit 1',
      color: '#E6AF2E',
      granularity: 'daily',
      include_weekends: true,
      granularity_times: 1,
      enough_amount: '',
      manage_from: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    } as DbResourceSchema<HabitsSchema>
    const date = DateTime.now().set({ day: 15 })

    let hookValues!: HabitTestValues
    render(
      <DbProvider externalDb={testDb}>
        <TestHabitConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )
    await waitFor(() => {
      expect(hookValues).toBeDefined()
      expect(testDb.isOpen()).toBe(true)
    })

    await testDb.habits.add(testHabit1)
    await hookValues.createMonthlySlots(date.toISO())
    const selectableHabits = await hookValues.fetchSelectableHabits(date.toISO(), date.toISO())

    const event = {
      habit_id: selectableHabits[0].id,
      datetime: date.toISO(),
      completed: 1
    } as EventsSchema
    const slot_id = selectableHabits[0].slot.id
    await hookValues.saveEvent(event, slot_id, date.toISO())
    const events = await testDb.events.toArray()
    const slot = await testDb.slots.filter(item => item.id === slot_id).first()
    await waitFor(() => {
      expect(events.length).toBe(1)
      expect(events[0].datetime).toBe(date.toISO())
      expect(slot?.event_ids.length).toBe(1)
      expect(slot?.event_ids[0]).toBe(events[0].id)
      expect(slot?.completion).toBe(1)
    })
  })
})