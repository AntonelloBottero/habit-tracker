import { render, waitFor, screen } from '@testing-library/react'
import useDb, { DbProvider } from '@/db/useDb'
import DbClass, { type HabitsSchema } from '@/db/DbClass'
import useDbCrud from '@/db/useDbCrud'

// --- Test db init (powered by fake-indexeddb) ---
const testDb = new DbClass('TestDatabase', 1)

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
// habit to CRUD
const testHabit: HabitsSchema = {
  type: 'good',
  name: 'Test habit 1',
  color: '#E6AF2E',
  granularity: 'daily',
  include_weekends: true,
  granularity_times: 1,
  enough_amount: ''
}

// DB CRUD consumer
interface DbTestCrudValues<T> {
  index: () => Promise<T[]>
  show: (id: string) => Promise<T | undefined>
  store: (values: Partial<T>) => Promise<boolean>
  update: (id: string, values: Partial<T>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
}

export const TestDbCrudConsumer = ({ onHookReady }: { onHookReady: (values: DbTestCrudValues<HabitsSchema>) => void }) => {
  const { index, show, store, update, deleteItem } = useDbCrud({ table: 'habits' })

  // callback that exposes methods to test
  onHookReady({ index, show, store, update, deleteItem })

  // No rendering needed
  return null
}

describe('DB CRUD', () => {
  test('create', async () => {
    let hookValues: DbTestCrudValues<HabitsSchema>
    render(
      <DbProvider externalDb={testDb}>
        <TestDbCrudConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )

    await waitFor(async () => {
      const stored = await hookValues.store(testHabit)
      expect(stored).toBe(true)
    })
  })

  test('index', async () => {
    let hookValues: DbTestCrudValues<HabitsSchema>
    render(
      <DbProvider externalDb={testDb}>
        <TestDbCrudConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )

    await waitFor(async () => {
      const testHabits = await hookValues.index()
      console.log('testHabits', testHabits)
      expect(testHabits.length).toBe(1)
      expect(testHabits[0].name).toBe('Test habit 1')
    })

    testDb.close()
    await testDb.delete()
  })
})