import { HabitRawProps } from '@/src/habits/mappers/HabitMapper'
import Dexie, { Table } from 'dexie'

// --- Schemas ---
export type DbResourceSchema<T> = Omit<T, 'id'> & {
  id: number
  created_at: string
  updated_at: string
  deleted_at: string
}

export type DexieTableName = 'habit'

class DexieDbClass extends Dexie {
  habits!: Table<DbResourceSchema<HabitRawProps>, 'id'>
  constructor(name: string) {
    super(name)
    this.version(3).stores({
      habits: `++id, type, name, color, granularity, include_weekends, granularity_times, enough_amount, manage_from, created_at, updated_at, deleted_at`,
    })
  }
}

export class DexieFactory {
  public static execute(): DexieDbClass {
    const db = new DexieDbClass('HabiterDatabase')
    db.open()
    return db
  }
}