import { EventRawProps } from '@/src/events/mappers/EventMapper'
import { HabitRawProps } from '@/src/habits/mappers/HabitMapper'
import { SlotRawProps } from '@/src/slots/mappers/SlotMapper'
import { UserRawProps } from '@/src/users/mappers/UserMapper'
import Dexie, { Table } from 'dexie'

export type DexieTableName = 'habits' | 'slots' | 'events' | 'users'

class DexieDbClass extends Dexie {
  habits!: Table<HabitRawProps, 'id'>
  slots!: Table<SlotRawProps, 'id'>
  events!: Table<EventRawProps, 'id'>
  users!: Table<UserRawProps, 'id'>

  constructor(name: string) {
    super(name)
    this.version(4).stores({
      habits: `++id, type, name, color, granularity, include_weekends, granularity_times, enough_amount, last_managed_at, last_updated_at, created_at, updated_at, deleted_at`,
      slots: '++id, habit_id, event_ids, count, completion, active_from, active_to, created_at, updated_at, deleted_at',
      events: '++id, habit_id, date, completed, created_at, updated_at, deleted_at',
      users: '++id, name, options, created_at, updated_at, deleted_at'
    })
  }
}

export class DexieFactory {
  private _db: DexieDbClass

  constructor() {
    this._db = new DexieDbClass('HDB')
    this._db.open()
  }

  public execute(): DexieDbClass {
    return this._db
  }
}