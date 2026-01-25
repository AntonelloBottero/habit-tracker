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

  const schema = useMemo<DbResourceSchema<T> | null>(() => {
    if(!table?.schema?.indexes) { return null }
    const s = Object.values(table.schema.indexes).reduce((r, index) => ({
      ...r,
      [index.name]: true
    }),{ id: true }) as DbResourceSchema<T>
    return objectIsCompliant(s, model) ? s : null
  }, [table])

  // --- Fetch ---
  interface SortBy {
    field: string
    reverse?: boolean
  }

  async function index(filter?: (item: DbResourceSchema<T>) => boolean, sortBy?: SortBy): Promise<DbResourceSchema<T>[]> {
    if(!isCompliant()) { return [] }
    let query = (table as Table).where('deleted_at').equals('')
    if(filter) {
      query.filter(filter).toArray()
    }
    if(sortBy?.field) {
      if(sortBy.reverse) { query.reverse() }
      query.sortBy(sortBy.field)
    } else {
      query.sortBy('created_at')
    }
    return query.toArray()
  }

  async function show(id: number): Promise<DbResourceSchema<T> | undefined> {
    if(!isCompliant()) { return undefined }
    const item = await (table as Table).where('id').equals(id).and(item => item.deleted_at === '').first()
    return item
  }

  // --- Store ---
  async function store(values: Partial<T>): Promise<DbResourceSchema<T> | false> {
    if(!isCompliant()) { return false }
    if(!objectIsCompliant(schema as object, values)) {
      throw new TypeError('Values are not fully compliant with schema')
    }
    const newId = await (table as Table).add({
      deleted_at: '',
      ...values,
      created_at: DateTime.now().toISO(),
    })
    return await show(newId) || false
  }

  async function bulkStore(values: Partial<T>[]): Promise<DbResourceSchema<T>[] | false> {
    if(!isCompliant() || !Array.isArray(values) || !values.length) { return false }
    const isAllCompliant = values.every((value) => objectIsCompliant(schema as DbResourceSchema<T>, value))
    if(!isAllCompliant) {
      throw new TypeError('Values are not fully compliant with schema')
    }
    const created_at = DateTime.now()
    const formattedValues = values.map((value, index) => ({
      deleted_at: '',
      ...value,
      created_at: created_at.plus({milliseconds: index}).toISO(), // slight difference to ensure index() will order them correctly
    }))
    const ids = await (table as Table).bulkAdd(formattedValues, undefined, { allKeys: true })
    return await index(item => ids.includes(item.id))
  }

  // --- Update ---
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
    const valueIds = values.map(v => v.id) as number[]
    const existingValues = await index(item => valueIds.includes(item.id)) // ensures that full resource will be updated, preventing potential data loss
    const isAllCompliant = values.every(value => {
      return existingValues.find(ev => ev.id === value.id) && objectIsCompliant(schema as DbResourceSchema<T>, value)
    })
    if(!isAllCompliant) {
      throw new TypeError('Values are not fully compliant with schema 2')
    }
    const updated_at = DateTime.now()
    const formattedValues = values.map((value, index) => ({
      ...existingValues.find(ev => ev.id === value.id),
      ...value,
      updated_at: updated_at.plus({milliseconds: index}).toISO(), // slight difference to ensure index() will order them correctly
    }))
    const ids = await (table as Table).bulkPut(formattedValues, undefined, { allKeys: true })
    return await index(item => ids.includes(item.id))
  }

  // --- Delete ---
  async function deleteItem(id: number): Promise<void> {
    const item = await show(id)
    if(!item) {
      throw new ReferenceError('Resource could not be found')
    }
    await (table as Table).delete(id)
  }

  async function bulkDelete(ids: number[]): Promise<void> {
    const items = await index(item => ids.includes(item.id))
    if(!items.length) {
      throw new ReferenceError('Resource could not be found')
    }
    await (table as Table).bulkDelete(ids)
  }

  return {
    db,
    index,
    show,
    store,
    bulkStore,
    update,
    bulkUpdate,
    deleteItem,
    bulkDelete,
    // for testing purposes
    isCompliant
  }
}