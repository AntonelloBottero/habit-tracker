import Dexie, { Table } from 'dexie' // Assumi di aver spostato gli schemi qui

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
  manage_from: string
}
export const habitsModel: HabitsSchema = {
  type: '',
  name: '',
  color: '',
  granularity: 'daily',
  include_weekends: false,
  granularity_times: 0,
  enough_amount: '',
  manage_from: ''
}

// events schema and model
export interface EventsSchema {
  habit_id: number | null
  datetime: string | null
  completed: number
}

export const eventsModel: EventsSchema = {
  habit_id: null,
  datetime: null,
  completed: 0
}

// slots schema and model
export interface SlotsSchema {
  habit_id: number | null
  event_ids: number[]
  count: number
  completion: number,
  active_to: string | null
}

export const slotsModel: SlotsSchema = {
  habit_id: null,
  event_ids: [],
  count: 0,
  completion: 0,
  active_to: null
}

export default class DbClass extends Dexie {
  options!: Table<OptionsSchema, 'id'>
  habits!: Table<HabitsSchema, 'id'>
  events!: Table<EventsSchema, 'id'>
  slots!: Table<SlotsSchema, 'id'>
  constructor(name: string) {
    super(name)
    this.version(1).stores({
      options: '++id, key, value',
      habits: `++id, type, name, color, granularity, include_weekends, granularity_times, enough_amount, created_at, updated_at, deleted_at`
    })
    this.version(2).stores({
      habits: `++id, type, name, color, granularity, include_weekends, granularity_times, enough_amount, manage_from, created_at, updated_at, deleted_at`,
      events: `++id, habit_id, datetime, completed, created_at, updated_at, deleted_at`,
      slots: `++id, habit_id, event_ids, count, completion, active_to, created_at, updated_at, deleted_at`
    })
  }
}
