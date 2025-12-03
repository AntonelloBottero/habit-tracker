import { render, waitFor } from '@testing-library/react'
import useDb, { DbProvider } from '@/db/useDb'
import DbClass from '@/db/DbClass'

// --- Test db init (powered by fake-indexeddb) ---
const testDb = new DbClass('TestDatabase', 1)

// --- Test consumer ---
interface DbTestValues {
    dbIsOpen: boolean | 'pending';
    getOption: (key: string) => Promise<unknown>;
    createOption: (key: string, value?: string | number) => Promise<true | string>;
}

export const TestDbConsumer = ({ onHookReady }: { onHookReady: (values: DbTestValues) => void }) => {
  const { dbIsOpen, getOption, createOption } = useDb()

  // callback that exposes methods to test
  onHookReady({ dbIsOpen, getOption, createOption })

  // No rendering needed
  return (
    <h1>
      Db is open
    </h1>
  )
}

describe('Db Provider', () => {


  test('opened db shows children', () => {
    let hookValues: DbTestValues

    render(
      <DbProvider externalDb={testDb}>
        <TestDbConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )

    waitFor(() => expect(hookValues.dbIsOpen).toBe('pending'))
  })

  test('true db open state', () => {
    let hookValues: DbTestValues

    render(
      <DbProvider externalDb={testDb}>
        <TestDbConsumer onHookReady={(values) => { hookValues = values }} />
      </DbProvider>
    )

    waitFor(() => expect(hookValues.dbIsOpen).toBe(true))
  })
})