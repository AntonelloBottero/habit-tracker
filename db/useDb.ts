import { useEffect } from 'react'
import Dexie, { Table } from 'dexie'

// --- Schemas and Models ---

// options schema
export interface OptionsSchema {
    key: string,
    value?: string | number
}

// habits schema and model
export interface HabitsSchema {
  type: 'good' | 'bad' | ''
  name: string
  color: string
  granularity: string
  include_weekends: boolean
  granularity_times: number,
  enough_amount: string
}
export const habitsModel: HabitsSchema = {
  type: '',
  name: '',
  color: '',
  granularity: 'daily',
  include_weekends: false,
  granularity_times: 0,
  enough_amount: ''
}

// --- Hook ---
export default function useDb(startup = false) {
  // --- DB setup ---
  class DB extends Dexie {
    options!: Table<OptionsSchema, 'id'>
    habits!: Table<HabitsSchema, 'id'>
    constructor() {
      super(process.env.dbName as string)
      this.version(Number(process.env.dbVersion)).stores({
        options: '++id, key, value',
        habits: `++id, ${Object.keys(habitsModel).join(', ')}, created_at, updated_at, deleted_at`
      })
    }
  }
  const db = new DB()

  // --- Open/Close db ---
  async function open() {
    if(db.isOpen()) { return undefined }
  }
  useEffect(() => {
    if(startup) {
      open()
    }

    return () => {
      // TODO trigger db close
      if(startup) {
        db.close()
      }
    }
  }, [startup])

  return { db }
}