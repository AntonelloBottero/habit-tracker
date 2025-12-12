import useDb from '@/db/useDb'
import { DateTime } from 'luxon'
import { objectIsCompliant } from "@/utils/index"
import { useMemo } from 'react'
import { type Table } from 'dexie'

interface Params {
  table: string
}

export default function useDbCrud<T extends object>({ table: storeName }: Params) {
  const { db } = useDb()

  const table = useMemo<Table | null>(() => {
    return db.table(storeName) || null
  }, [name])

  function isCompliant() {
    if(!db.isOpen()) { return false }
    if(!db.table(storeName)) { return false }
    if(!model) { return false}
    return true
  }

  const model = useMemo<T | null>(() => {
    if(!table?.schema?.indexes) { return null }
    return Object.values(table.schema.indexes).reduce((r, index) => ({
      ...r,
      [index.name]: true
    }),{}) as T
  }, [table])

  // --- DB Operations ---
  const index = async (filter?: (item: T) => boolean): Promise<T[]> => {
    if(!isCompliant()) { return [] }
    let query = (table as Table).where('deleted_at').equals('') // TODO sort by created_at
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
    if(!objectIsCompliant(model as T, values)) {
      throw new TypeError('Values are not fully compliant with model')
    }
    await (table as Table).add({
      ...values,
      created_at: DateTime.now().toISO(),
      deleted_at: ''
    })
    return true
  }
  const update = async (id: number, values: Partial<T>): Promise<void> => {
    if(!objectIsCompliant(model as T, values)) {
      throw new TypeError('Values are not fully compliant with model')
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
    index,
    show,
    store,
    update,
    deleteItem
  }
}