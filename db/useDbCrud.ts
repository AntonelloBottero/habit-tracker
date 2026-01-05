import useDb from '@/db/useDb'
import { DateTime } from 'luxon'
import { objectIsCompliant } from "@/utils/index"
import { useMemo } from 'react'
import { type Table } from 'dexie'
import { type DbResourceSchema } from '@/db/DbClass'

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
  async function index(filter?: (item: DbResourceSchema<T>) => boolean): Promise<DbResourceSchema<T>[]> {
    if(!isCompliant()) { return [] }
    const query = (table as Table).where('deleted_at').equals('') // TODO sort by created_at
    return filter
      ? query.filter(filter).toArray()
      : query.toArray()
  }

  async function show(id: number): Promise<DbResourceSchema<T> | undefined> {
    if(!isCompliant()) { return undefined }
    const item = await (table as Table).where('id').equals(id).and(item => item.deleted_at === '').first()
    return item
  }

  async function store(values: Partial<T>): Promise<boolean> {
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

  async function bulkStore(values: Partial<T>[]): Promise<DbResourceSchema<T>[] | false> {
    if(!isCompliant() || !Array.isArray(values) || !values.length) { return false }
    const formattedValues = values.reduce((r, v) => {
      if(!objectIsCompliant(schema as object, v) || !r) { return false }
      return [
        ...r,
        {
          deleted_at: '',
          ...v,
          created_at: DateTime.now().toISO(),
        }
      ]
    }, [])
    if(!formattedValues) {
      throw new TypeError('Values are not fully compliant with schema')
    }
    const ids = await (table as Table).bulkAdd(formattedValues, undefined, { allKeys: true })
    return await index(item => ids.includes(item.id))
  }

  async function update(id: number, values: Partial<DbResourceSchema<T>>): Promise<void> {
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

  async function bulkUpdate(values: Partial<DbResourceSchema<T>>[]): Promise<DbResourceSchema<T>[] | false> {
    if(!isCompliant() || !Array.isArray(values) || !values.length) { return false }
    const valueIds = values.map(v => v.id)
    const existingValues = await index(item => valueIds.includes(item.id))
    const formattedValues = values.reduce((r, v) => {
      if(!objectIsCompliant(schema as object, v) || !r) { return false }
      return [
        ...r,
        {
          ...v,
          updated_at: DateTime.now().toISO(),
        }
      ]
    }, [])
  }

  async function deleteItem(id: number): Promise<void> {
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
    bulkStore,
    update,
    deleteItem,
    // for testing purposes
    isCompliant
  }
}