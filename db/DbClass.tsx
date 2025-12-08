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

export default class DbClass extends Dexie {
  options!: Table<OptionsSchema, 'id'>
  habits!: Table<HabitsSchema, 'id'>
  constructor(name: string, version: number = 1) {
    super(name)
    this.version(version).stores({
      options: '++id, key, value',
      habits: `++id, ${Object.keys(habitsModel).join(', ')}, created_at, updated_at, deleted_at`
    })
  }
}
