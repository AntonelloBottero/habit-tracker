import useDb from '@/db/useDb'
import { DateTime } from 'luxon'
import { objectIsCompliant } from "@/utils/index"
import { useMemo } from 'react'
import { type Table } from 'dexie'

interface Params<T> {
  table: string
  model: T
}

export default function useDbCrud<T extends object>({ table: storeName, model }: Params<T>) {
  const { db, dbIsOpen } = useDb()

  const table = useMemo<Table | null>(() => {
    return db.table(storeName) || null
  }, [name])

  function isCompliant() {
    if(dbIsOpen !== true) { return false }
    if(!schema) { return false}
    return true
  }

  const schema = useMemo<T | null>(() => {
    if(!table?.schema?.indexes) { return null }
    const s = Object.values(table.schema.indexes).reduce((r, index) => ({
      ...r,
      [index.name]: true
    }),{}) as T
    return objectIsCompliant(s, model) ? s : null
  }, [table])

  // --- DB Operations ---
  const index = async (filter?: (item: T) => boolean): Promise<T[]> => {
    if(!isCompliant()) { return [] }
    const query = (table as Table).where('deleted_at').equals('') // TODO sort by created_at
    return filter
      ? query.filter(filter).toArray()
      : query.toArray()
  }
  const show = async (id: number): Promise<T | undefined> => {
    if(!isCompliant()) { return undefined }
    const item = await (table as Table).where('id').equals(id).and(item => item.deleted_at === '').first()
    return item
  }
  const store = async (values: Partial<T>): Promise<boolean> => {
    if(!isCompliant()) { return false }
    if(!objectIsCompliant(schema as object, values)) {
      throw new TypeError('Values are not fully compliant with schema')
    }
    await (table as Table).add({
      deleted_at: '',
      ...values,
      created_at: DateTime.now().toISO(),
    })
    return true
  }
  const update = async (id: number, values: Partial<T>): Promise<void> => {
    if(!objectIsCompliant(schema as object, values)) {
      throw new TypeError('Values are not fully compliant with schema')
    }
    const item = await show(id)
    if(!item) {
      throw new ReferenceError('Resource could not be found')
    }
    await (table as Table).put({
      ...item,
      ...values,
      updated_at: DateTime.now().toISO()
    })
  }
  const deleteItem = async(id: number): Promise<void> => {
    const item = await show(id)
    if(!item) {
      throw new ReferenceError('Resource could not be found')
    }
    await (table as Table).delete(id)
  }

  return {
    db,
    index,
    show,
    store,
    update,
    deleteItem,
    // for testing purposes
    isCompliant
  }
}