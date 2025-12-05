import { render, waitFor, screen } from '@testing-library/react'
import useDb, { DbProvider } from '@/db/useDb'
import DbClass from '@/db/DbClass'

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

  // No rendering needed
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

  test('Create option', async () => {
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
    })
  })
})