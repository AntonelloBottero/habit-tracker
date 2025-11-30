/**
 * DBClass
 * @util
 * exports table schemas and DB class instance needed to make db operations
 */
import Dexie, { type Table } from 'dexie'

// --- options schema ---
export interface OptionsSchema {
    key: string,
    value?: string | number
}

// --- Habits schema and model ---
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

// --- DB class ---
export default class DBClass extends Dexie {
  options!: Table<OptionsSchema, 'id'>
  habits!: Table<HabitsSchema, 'id'>
  constructor() {
    super('HabiterDatabase')
    this.version(1).stores({
      options: '++id, key, value',
      habits: `++id, ${Object.keys(habitsModel).join(', ')}, created_at, updated_at, deleted_at`
    })
  }
}