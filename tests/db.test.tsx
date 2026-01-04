import { render, waitFor, screen, act } from '@testing-library/react'
import { DateTime } from 'luxon'
import useDb, { DbProvider } from '@/db/useDb'
import DbClass, { DbResourceSchema, habitsModel, type HabitsSchema } from '@/db/DbClass'
import useDbCrud from '@/db/useDbCrud'

// --- Test db init (powered by fake-indexeddb) ---
const testDb = new DbClass('TestDatabase')

// --- Test consumer ---
interface DbTestValues {
    dbIsOpen: boolean | 'pending';
    getOption: (key: string) => Promise<unknown>;
    createOption: (key: string, value?: string | number) => Promise<boolean>;
}

export const TestDbConsumer = ({ onHookReady }: { onHookReady: (values: DbTestValues) => void }) => {
  const { dbIsOpen, getOption, createOption } = useDb()

  // callback that exposes methods to test
  onHookReady({ dbIsOpen, getOption, createOption })

  return (
    <h1>
      Consumer is rendered
    </h1>
  )
}

describe('Db Provider', () => {
  beforeEach(async () => {
    await testDb.delete()
  })
  afterAll(() => {
    testDb.close()
  })

  test('pending db open state', async () => {
    let hookValues: DbTestValues
    render(
      <DbProvider externalDb={testDb}>
        <TestDbConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )

    await waitFor(() => {
      expect(hookValues.dbIsOpen).toBe('pending')
    })
    const ConsumerTitle = screen.getByRole('heading', {level: 1})
    waitFor(() => {
      expect(ConsumerTitle).toBeNull()
    })

  })

  test('true db open state', async () => {
    let hookValues: DbTestValues
    render(
      <DbProvider externalDb={testDb}>
        <TestDbConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )

    await waitFor(() => {
      expect(hookValues.dbIsOpen).toBe(true)
    })
    const ConsumerTitle = screen.getByRole('heading', {level: 1})
    waitFor(() => {
      expect(ConsumerTitle).toBeInTheDocument()
    })
  })

  test('Create and get option', async () => {
    let hookValues: DbTestValues
    render(
      <DbProvider externalDb={testDb}>
        <TestDbConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )
    await waitFor(async () => {
      expect(hookValues.dbIsOpen).toBe(true)
      const created = await hookValues.createOption('test', 1)
      expect(created).toBe(true)
      const option = await hookValues.getOption('test')
      expect(option).toBe(1)
    })
  })
})

// --- DB CRUD ---
// habits to CRUD
const testHabit: HabitsSchema = {
  type: 'good',
  name: 'Test habit 1',
  color: '#E6AF2E',
  granularity: 'daily',
  include_weekends: true,
  granularity_times: 1,
  enough_amount: '',
  manage_from: ''
}
const testHabit2 = {
  type: 'good',
  name: 'Test habit 2',
  color: '#E6AF2E',
  granularity: 'daily',
  include_weekends: true,
  granularity_times: 1,
  enough_amount: '',
  manage_from: ''
} as HabitsSchema
const testHabit3 = {
  type: 'good',
  name: 'Test habit 3',
  color: '#E6AF2E',
  granularity: 'daily',
  include_weekends: true,
  granularity_times: 1,
  enough_amount: '',
  manage_from: '',
  deleted_at: DateTime.now().toISO()
} as HabitsSchema

// DB CRUD consumer
interface DbTestCrudValues<T> {
  index: () => Promise<T[]>
  show: (id: number) => Promise<T | undefined>
  store: (values: Partial<T>) => Promise<boolean>
  bulkStore: (values: Partial<T>[]) => Promise<DbResourceSchema<T>[]>
  update: (id: number, values: Partial<T>) => Promise<void>
  bulkUpdate: (values: Partial<DbResourceSchema<T>>) => Promise<DbResourceSchema<T>[]>
  deleteItem: (id: number) => Promise<void>
  bulkDelete: (ids: number[]) => Promise<void>
  isCompliant: () => boolean
}

export const TestDbCrudConsumer = ({ onHookReady }: { onHookReady: (values: DbTestCrudValues<HabitsSchema>) => void }) => {
  const { index, show, store, update, deleteItem, isCompliant } = useDbCrud({ table: 'habits', model: habitsModel })

  // callback that exposes methods to test
  onHookReady({ index, show, store, bulkStore, update, bulkUpdate, deleteItem, bulkDelete, isCompliant })

  // No rendering needed
  return null
}

describe('DB CRUD', () => {
  beforeEach(async () => {
    await testDb.delete()
  })

  afterAll(() => {
    testDb.close()
  })

  test('store', async () => {
    let hookValues!: DbTestCrudValues<HabitsSchema>
    render(
      <DbProvider externalDb={testDb}>
        <TestDbCrudConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )

    await waitFor(() => {
      expect(hookValues).toBeDefined()
      expect(hookValues.isCompliant()).toBe(true)
    })

    await hookValues.store(testHabit)
    const testHabits = await hookValues.index()

    await waitFor(async () => {
      expect(testHabits.length).toBe(1)
      expect(testHabits[0].name).toBe(testHabit.name)
    })
  })

  test('bulkStore', async () => {
    let hookValues!: DbTestCrudValues<HabitsSchema>
    render(
      <DbProvider externalDb={testDb}>
        <TestDbCrudConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )
    await waitFor(() => {
      expect(hookValues).toBeDefined()
      expect(hookValues.isCompliant()).toBe(true)
    })

    const storedHabits = await hookValues.bulkStore([testHabit, testHabit2, testHabit3])
    const testHabits = await hookValues.index()
    await waitFor(() => {
      expect(storedHabits.length).toBe(3)
      expect(storedHabits.length).toBe(testHabits.length)
      expect(storedHabits[0].name).toBe(testHabits[1].name)
    })
  })

  test('index', async () => {
    let hookValues!: DbTestCrudValues<HabitsSchema>
    render(
      <DbProvider externalDb={testDb}>
        <TestDbCrudConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )

    await waitFor(() => {
      expect(hookValues).toBeDefined()
      expect(hookValues.isCompliant()).toBe(true)
    })

    await hookValues.store(testHabit)
    await hookValues.store(testHabit2)
    await hookValues.store(testHabit3)
    const testHabits = await hookValues.index()

    await waitFor(async () => {
      expect(testHabits.length).toBe(2)
      expect(testHabits[0].name).toBe(testHabit.name)
    })
  })

  test('show', async () => {
    let hookValues!: DbTestCrudValues<HabitsSchema>
    render(
      <DbProvider externalDb={testDb}>
        <TestDbCrudConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )

    await waitFor(async () => {
      await hookValues.store(testHabit)
      const shownTestHabit = await hookValues.show(1)
      expect(shownTestHabit?.name).toBe('Test habit 1')
    })
  })

  test('update', async () => {
    let hookValues!: DbTestCrudValues<HabitsSchema>
    render(
      <DbProvider externalDb={testDb}>
        <TestDbCrudConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )

    await waitFor(() => {
      expect(hookValues).toBeDefined()
      expect(hookValues.isCompliant()).toBe(true)
    })

    await hookValues.store(testHabit)
    const name = 'Test habit edit'
    await hookValues.update(1, { name })
    const shownTestHabit = await hookValues.show(1)

    await waitFor(async () => {
      expect(shownTestHabit?.name).toBe(name)
    })
  })

  test('bulkPut', async () => {

  })

  test('deleteItem', async () => {
    let hookValues!: DbTestCrudValues<HabitsSchema>
    render(
      <DbProvider externalDb={testDb}>
        <TestDbCrudConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )

    await waitFor(async () => {
      await hookValues.store(testHabit)
      const testHabits = await hookValues.index()
      expect(testHabits.length).toBe(1)
      await hookValues.deleteItem(1)
      const newTestHabits = await hookValues.index()
      expect(newTestHabits.length).toBe(0)
    })
  })
})