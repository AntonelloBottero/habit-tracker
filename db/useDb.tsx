'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Dexie, { type Table } from 'dexie'

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

interface AvailableOptionValues {
  [key: string]: unknown
}


// --- DB setup ---
class DB extends Dexie {
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
const db = new DB()

// --- Context Provider ---
interface DbContextProvider {
  db: DB
  dbIsOpen: boolean | 'pending'
  createOption: (key: string, value?: string | number) => Promise<true | string>
  getOption: (key: string) => Promise<unknown>
}

const DbContext = createContext<DbContextProvider | null>(null)

export function DbProvider({ children }: Readonly<{ children: ReactNode }>) {
  // --- Open db ---
  const [dbIsOpen, setDbIsOpen] = useState<boolean | 'pending'>(false)
  async function open() {
    if(db.isOpen()) { return undefined }
    setDbIsOpen('pending')
    try {
    await db.open()
    setDbIsOpen(true)
    } catch(error) {
      setDbIsOpen(false)
    }
  }
  useEffect(() => {
    open()
  }, [])

  // --- Manage options ---
  const [availableOptionValues, setAvailableOptionValues] = useState<AvailableOptionValues>({}) // Options requested already in the current session

  // get option
  const showOption = async (key: string): Promise<OptionsSchema | undefined> => {
    if(!key) { return undefined }
    try {
      const option: OptionsSchema | undefined = await db.options.where('key').equalsIgnoreCase(key).first()
      return option
    } catch(error) {
      return undefined
    }
  }

  // insert new option, or update it if the key exists already
  const createOption = async (key: string, value?: string | number): Promise<true | string> => {
    if(!key) { return 'No key specified for your option' }
    const formattedKey = key.toLocaleLowerCase()
    const option = await showOption(key)
    if(!option) {
      await db.options.add({ key: formattedKey, value })
    } else {
      db.options.put({
        ...option,
        value
      })
    }
    return true
  }

  // retrieves an option
  const getOption = async (key: string): Promise<unknown> => {
    const availableOption: unknown = availableOptionValues[key]
    if(availableOption) { return availableOption }

    // if option doesn't exist, we try to fetch it
    const fetchedOption = await showOption(key)
    if(!fetchedOption) { return undefined }
    // if option exists, we add its value to the available option values, and return its value
    setAvailableOptionValues({
      ...availableOptionValues,
      [key]: fetchedOption.value
    })
    return fetchedOption.value
  }

  return (
    <DbContext.Provider value={ { db, dbIsOpen, createOption, getOption } }>
      {dbIsOpen && children}
    </DbContext.Provider>
  )
}

// Hook for consumers
export default function useDb() {
  const context = useContext(DbContext)
  if (!context) {
    throw new Error('useDb must be used within a OptionsProvider')
  }
  return context
}