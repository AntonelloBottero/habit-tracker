import useDb from '@/db/useDb'
import { DateTime } from 'luxon'
import { objectIsCompliant } from "@/utils/index"
import { useEffect } from 'react'

interface Params<T> {
  table: string
  model: T
}

export default function useDbCrud<T extends object>({ table, model }: Params<T>) {
  const { db } = useDb()

  function isCompliant() {
    if(!db.isOpen()) { return false }
    if(!db.table(table)) { return false }
    return true
  }

  useEffect(() => {
    console.log('dexie table', db.table(table))
  }, [table])

  // --- DB Operations ---
  const index = async (): Promise<T[]> => {
    if(!isCompliant()) { return [] }
    const items = await db[table].where('deleted_at').equals(null).all()
    return items
  }
  const show = async (id: string): Promise<T | undefined> => {
    if(!isCompliant()) { return undefined }
    const item = await db[table].where('id').equalsIgnoreCase(id).and('deleted_at').equals(null).first()
    return item
  }
  const store = async (values: Partial<T>): Promise<void> => {
    if(!isCompliant()) { return undefined }
    if(!objectIsCompliant(model, values)) {
      throw new TypeError('Values are not fully compliant with model')
    }
    await db[table].add({
      ...values,
      created_at: DateTime.now().toISO()
    })
  }
  const update = async (id: string, values: Partial<T>): Promise<void> => {
    if(!objectIsCompliant(model, values)) {
      throw new TypeError('Values are not fully compliant with model')
    }
    const item = await show(id)
    if(!item) {
      throw new ReferenceError('Resource could not be found')
    }
    await db[table].put({
      ...item,
      ...values,
      updated_at: DateTime.now().toISO()
    })
  }
  const deleteItem = async(id: string): Promise<void> => {
    const item = await show(id)
    if(!item) {
      throw new ReferenceError('Resource could not be found')
    }
    await db[table].delete(id)
  }

  return {
    index,
    show,
    store,
    update,
    deleteItem
  }
}