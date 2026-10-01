import { HabitRawProps } from '@/src/habits/mappers/HabitMapper'
import Dexie, { Table } from 'dexie'

// --- Schemas ---
export type DbResourceSchema<T> = Omit<T, 'id'> & {
  id: number
  created_at: string
  updated_at: string
  deleted_at: string
}

export type DexieTableName = 'habit' | 'slot' | 'event'

class DexieDbClass extends Dexie {
  habits!: Table<DbResourceSchema<HabitRawProps>, 'id'>
  constructor(name: string) {
    super(name)
    this.version(3).stores({
      habits: `++id, type, name, color, granularity, include_weekends, granularity_times, enough_amount, last_managed_at, last_updated_at, created_at, updated_at, deleted_at`,
      slots: '++id, habit_id, event_ids, count, completion, active_from, active_to, created_at, updated_at, deleted_at',
      events: '++id, habit_id, date, completed, created_at, updated_at, deleted_at'
    })
  }
}

export class DexieFactory {
  private _db: DexieDbClass

  constructor() {
    this._db = new DexieDbClass('HabiterDatabase')
    this._db.open()
  }

  public execute(): DexieDbClass {
    return this._db
  }
}